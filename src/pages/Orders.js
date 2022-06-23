import React from "react";
import { Table, TableHeader, TableCell, TableFooter, TableContainer, Select, Input, Card, CardBody, Pagination } from "@windmill/react-ui";

import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import NotFound from "../components/table/NotFound";
import OrderServices from "../services/OrderServices";
import Loading from "../components/preloader/Loading";
import OrderTable from "../components/order/OrderTable";
import PageTitle from "../components/Typography/PageTitle";
import { orders } from "../util/orders";

const Orders = () => {
  // const { data, loading } = useAsync(OrderServices.getAllOrders);
  const data = orders;
  const loading = false;

  const { orderRef, setStatus, setTime, handleChangePage, totalResults, resultsPerPage, dataTable, serviceData, handleSubmitOrder } = useFilter(data);

  return (
    <>
      <PageTitle>Orders</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form onSubmit={handleSubmitOrder} className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:grid-cols-3 xl:grid-cols-3">
            <div>
              <Input
                ref={orderRef}
                type="search"
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                placeholder="Search by phone"
              />
            </div>
            <div>
              <Select
                onChange={(e) => setStatus(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
              >
                <option value="Status" defaultValue hidden>
                  Status
                </option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Cancel">Cancel</option>
              </Select>
            </div>
            <div>
              <Select
                onChange={(e) => setTime(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
              >
                <option value="Order limits" defaultValue hidden>
                  Order limits
                </option>
                <option value="5">Last 5 days orders</option>
                <option value="7">Last 7 days orders</option>
                <option value="15">Last 15 days orders</option>
                <option value="30">Last 30 days orders</option>
              </Select>
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : serviceData.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Order ID</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Shipping Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell className="text-center">Status</TableCell>
                <TableCell className="text-center">Action</TableCell>
                <TableCell className="text-right">Invoice</TableCell>
              </tr>
            </TableHeader>
            <OrderTable orders={dataTable} />
          </Table>
          <TableFooter>
            <Pagination totalResults={totalResults} resultsPerPage={resultsPerPage} onChange={handleChangePage} label="Table navigation" />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Order" />
      )}
    </>
  );
};

export default Orders;
