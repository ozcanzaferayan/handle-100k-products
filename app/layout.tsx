import "./globals.css";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta
          property="og:image"
          content="https://handle-100k-products.vercel.app/api/og"
        />
        <meta name="twitter:card" content="SUMMARY" />
        <meta name="twitter:title" content="Handle 100k" />
        <meta name="twitter:description" content="Handle 100k products" />
        <meta
          name="twitter:url"
          content="https://handle-100k-products.vercel.app/"
        />
        <meta
          name="twitter:image"
          content="https://handle-100k-products.vercel.app/api/og"
        />
      </Head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
