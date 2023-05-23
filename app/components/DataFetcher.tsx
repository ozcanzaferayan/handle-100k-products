"use client";
import { useEffect, useState } from "react";
import {
  Product,
  getJSONFromIndexedDB,
  saveJSONToIndexedDB,
} from "./indexedDbService";
import Pagination from "./Pagination";

export default function DataFetcher() {
  const [data, setData] = useState<Product[]>([]);
  const [status, setStatus] = useState("idle");
  const [dbStatus, setDbStatus] = useState("idle");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  useEffect(() => {
    setStatus("fetching");

    const worker = new Worker("worker.js");

    worker.addEventListener("message", async (event) => {
      const jsonData = event.data;
      saveJSONToIndexedDB(jsonData);
      setStatus("fetched");
    });

    worker.postMessage("start");

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    if (status === "fetched") {
      fetchData(currentPage);
    }
  }, [currentPage, status]);

  const fetchData = async (page: number) => {
    setDbStatus("dbOpening");
    const {
      data: fetchedData,
      totalCount,
      totalPages,
    } = await getJSONFromIndexedDB(pageSize, currentPage);
    setDbStatus("dbOpened");

    setData(fetchedData);
    setTotalPages(totalPages);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (status === "fetching") {
    return <div>Fetching</div>;
  }

  if (status === "fetched") {
    return (
      <>
        <div>Fetched</div>
        <div>{dbStatus}</div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Category</th>
                <th>Desc</th>
                <th>Price</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <tr key={product.id}>
                  <td> {product.id} </td>
                  <td> {product.name} </td>
                  <td> {product.category} </td>
                  <td> {product.description} </td>
                  <td> {product.price} </td>
                  <td> {product.quantity} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );
  }

  return <h1>Idle</h1>;
}
