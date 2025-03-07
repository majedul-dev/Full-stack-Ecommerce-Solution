// Add this directive at the top
import Providers from '../../components/Providers';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function RootLayout({ children }) {
  return (
    <Providers>
      <div className="flex">
        <Sidebar/>
        <main className={`flex-1 md:ml-64 h-screen overflow-y-auto`}>
          <Header />
          <div className='p-2 sm:p-4 md:p-6'>
            {children}
          </div>
        </main>
      </div>
    </Providers>
  );
}