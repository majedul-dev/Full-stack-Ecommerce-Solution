const UserModel = require('../../models/userModel');
const ProductModel = require('../../models/productModel');
const Order = require('../../models/orderModel');
const Category = require('../../models/categoryModel');
const Asset = require('../../models/Asset');

exports.getDashboardData = async (req, res) => {
  try {
    // Execute all queries in parallel for better performance
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalAssets,
      userStats,
      productStats,
      orderStats,
      salesData,
      recentOrders,
      recentUsers,
      stockStatus,
      topProducts
    ] = await Promise.all([
      UserModel.countDocuments(),
      ProductModel.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments(),
      Asset.countDocuments(),
      
      // User Statistics
      UserModel.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $group: { 
          _id: null,
          roles: { $push: { role: '$_id', count: '$count' } },
          total: { $sum: '$count' }
        }}
      ]),
      
      // Product Statistics
      ProductModel.aggregate([
        { $group: { 
          _id: null,
          totalPublished: { $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] } },
          totalFeatured: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } },
          averagePrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' }
        }}
      ]),
      
      // Order Statistics
      Order.aggregate([
        { 
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            statusCounts: { 
              $push: {
                status: '$status',
                count: { $sum: 1 }
              }
            }
          }
        }
      ]),
      
      // Sales Data (last 30 days)
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            totalSales: { $sum: '$totalAmount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      // Recent Data
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email'),
        
      UserModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role status createdAt'),
        
      // Stock Status
      ProductModel.aggregate([
        { $group: { _id: '$stockStatus', count: { $sum: 1 } } }
      ]),
      
      // Top Selling Products
      Order.aggregate([
        { $unwind: '$products' },
        { 
          $group: {
            _id: '$products.productId',
            totalSold: { $sum: '$products.quantity' },
            totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' }
      ])
    ]);

    // Structure the response
    const dashboardData = {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        totalAssets
      },
      users: {
        stats: userStats[0]?.roles || [],
        statusDistribution: await UserModel.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        recent: recentUsers
      },
      products: {
        ...productStats[0],
        stockStatus,
        recentAdded: await ProductModel.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('productName price stockStatus'),
        topSelling: topProducts
      },
      orders: {
        totalRevenue: orderStats[0]?.totalRevenue || 0,
        averageOrderValue: orderStats[0]?.averageOrderValue || 0,
        statusDistribution: orderStats[0]?.statusCounts || [],
        paymentMethods: await Order.aggregate([
          { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
        ]),
        recent: recentOrders
      },
      salesAnalytics: {
        last30Days: salesData,
        categoryDistribution: await Order.aggregate([
          { $unwind: '$products' },
          {
            $lookup: {
              from: 'products',
              localField: 'products.productId',
              foreignField: '_id',
              as: 'productDetails'
            }
          },
          { $unwind: '$productDetails' },
          { $group: { _id: '$productDetails.category', totalSales: { $sum: '$products.quantity' } } }
        ])
      },
      system: {
        storage: await Asset.aggregate([
          { $group: { 
            _id: '$resource_type',
            count: { $sum: 1 },
            totalSize: { $sum: '$bytes' }
          }}
        ])
      }
    };

    res.status(200).json({
        success: true,
        error: false,
        message: "Dashboard data fetched successfully",
        data: dashboardData
    });
    
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard data',
      error: error.message
    });
  }
};