"use client";
import React, { useEffect, useState } from "react";
import DataFetcher from "./components/DataFetcher";

const ClientPage = () => {
  const [showComponent, setShowComponent] = useState(false);
  // For performance testing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return <>{showComponent && <DataFetcher />}</>;
};

export default ClientPage;
