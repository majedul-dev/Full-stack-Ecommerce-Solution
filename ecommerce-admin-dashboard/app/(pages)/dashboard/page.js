import DashboardWrapper from "./DashboardWrapper";

const getDashboardData = async () => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/dashboard`);
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

const DashboardPage = async () => {
  const responds = await getDashboardData()
  return (
    <DashboardWrapper data={responds.data} />
  )
}

export default DashboardPage