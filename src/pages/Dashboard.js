import { Bar, Doughnut } from "react-chartjs-2";
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck } from "react-icons/fi";
import { Pagination, Table, TableCell, TableContainer, TableFooter, TableHeader } from "@windmill/react-ui";
import React, { useEffect } from "react";
import { barLegends, barOptions, doughnutLegends, doughnutOptions } from "../utils/chartsData";
import { useDispatch, useSelector } from "react-redux";

import CardItem from "../components/dashboard/CardItem";
import ChartCard from "../components/chart/ChartCard";
import ChartLegend from "../components/chart/ChartLegend";
import Loading from "../components/preloader/Loading";
import OrderServices from "../services/OrderServices";
import OrderTable from "../components/dashboard/OrderTable";
import PageTitle from "../components/Typography/PageTitle";
import apiService from "../utils/apiService";
import axios from "axios";
import { messaging } from "../utils/firebase";
import { orders } from "../util/orders";
import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";

const Dashboard = () => {
  // const { data, loading } = useAsync(OrderServices.getAllOrders);
  const data = orders;
  const loading = false;
  const { handleChangePage, totalResults, resultsPerPage, dataTable, pending, processing, delivered } =
    useFilter(data);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    Notification.requestPermission()
      .then(() => {
        return messaging.getToken();
      })
      .then(async (token) => {
        localStorage.setItem("firebase-token", token);
        await apiService
          .post("user_service", "/user_device", { firebaseToken: token })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <PageTitle>Dashboard Overview</PageTitle>
      <div className="grid gap-4 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <CardItem
          title="Total Order"
          Icon={FiShoppingCart}
          quantity={data.length}
          className="text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500"
        />
        <CardItem
          title="Order Pending"
          Icon={FiRefreshCw}
          quantity={pending.length}
          className="text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500"
        />
        <CardItem
          title="Order Processing"
          Icon={FiTruck}
          quantity={processing.length}
          className="text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500"
        />
        <CardItem
          title="Order Delivered"
          Icon={FiCheck}
          quantity={delivered.length}
          className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Conversions This Year">
          <Bar {...barOptions} />
          <ChartLegend legends={barLegends} />
        </ChartCard>
        <ChartCard title="Top Revenue Product">
          <Doughnut {...doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>
      </div>

      <PageTitle>Recent Order</PageTitle>
      {loading && <Loading loading={loading} />}
      {dataTable && !loading && (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Order Time</TableCell>
                <TableCell>Delivery Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Payment method</TableCell>
                <TableCell>Order amount</TableCell>
                <TableCell>Status</TableCell>
              </tr>
            </TableHeader>
            <OrderTable orders={dataTable} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      )}
    </>
  );
};

export default Dashboard;
