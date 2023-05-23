import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
}

interface MyDb extends DBSchema {
  [key: string]: {
    key: number;
    value: Product;
  };
}

const DB_NAME = "MyDatabase";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "Products";

const openDatabase = (): Promise<IDBPDatabase<MyDb>> => {
  return openDB<MyDb>(DB_NAME, DB_VERSION, {
    upgrade(schemaDb) {
      const db = schemaDb as IDBPDatabase;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

const saveJSONToIndexedDB = async (jsonData: Product[]): Promise<void> => {
  const schemaDb = await openDatabase();
  const db = schemaDb as IDBPDatabase;
  const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
  const store = tx.objectStore(OBJECT_STORE_NAME);

  await Promise.all(jsonData.map((item) => store.put(item)));

  await tx.done;
};

const getJSONFromIndexedDB = async (
  pageSize: number,
  currentPage: number
): Promise<{
  data: Product[];
  totalCount: number;
  totalPages: number;
}> => {
  const schemaDb = await openDatabase();
  const db = schemaDb as IDBPDatabase;
  const store = db
    .transaction(OBJECT_STORE_NAME, "readonly")
    .objectStore(OBJECT_STORE_NAME);

  const totalCount = await store.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  const startCursor = (currentPage - 1) * pageSize;
  const endCursor = startCursor + pageSize;

  const cursor = await store.openCursor();
  const paginatedData: Product[] = [];
  let index = 0;
  while (cursor) {
    if (index >= startCursor && index < endCursor) {
      paginatedData.push(cursor.value);
    }
    if (index >= endCursor) {
      break;
    }
    index++;

    await cursor.continue();
  }

  console.log(paginatedData);
  return {
    data: paginatedData,
    totalCount,
    totalPages,
  };
};

export { saveJSONToIndexedDB, getJSONFromIndexedDB };
