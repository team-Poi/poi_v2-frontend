// /api/text/data/:link
/*
{
  s: boolean;
  e: string;
}
 */
import axios from "axios";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import common from "./../../styles/common.module.css";
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import styles from "@/styles/text.module.css";
import Head from "next/head";

const Conatiner = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Container"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);

const Features = dynamic(() => import("@/components/features"), {
  loading() {
    return <div>Loading...</div>;
  },
});

const Header = dynamic(() => import("@/components/header/index"), {
  loading() {
    return <div>Loading...</div>;
  },
});

const Saero = dynamic(() => import("@team.poi/ui/dist/cjs/components/Column"), {
  loading() {
    return <div>Loading...</div>;
  },
});

function HTMLRenderer(props: { html: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: props.html }}
      className={styles.cont}
    />
  );
}

// https://ilydev.com:3070/t/JCrPfz
export default function TextView({
  i,
  e,
  meta,
}: {
  i: string;
  e: string;
  meta: {
    url: string;
    title: string;
    description: string;
  };
}) {
  if (e == "<meta>")
    return (
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.url} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:site_name" content="poi.kr (포이)" />
        <meta property="og:locale" content="en_US" />
      </Head>
    );
  return (
    <>
      <Header linked="/text" type="TEXT" />
      <Saero
        className={classNames(common.centerFlex, common.w100, styles.saero)}
      >
        <Conatiner>
          <h1>Shared text by someone / {i}</h1>
          <div>
            <HTMLRenderer html={e} />
          </div>
        </Conatiner>

        <Features />
      </Saero>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let link = context.query["id"];
  if (!link)
    return {
      redirect: {
        destination: "/errors/text",
        permanent: false,
      },
    };
  try {
    let res = await axios.get(`${process.env.SERVER}/text/data/${link}`, {
      headers: {
        "User-Agent": context.req.headers["user-agent"],
      },
    });
    let data = res.data as {
      s: boolean;
      e: string;
      meta?: any;
    };
    return {
      props: data,
    };
  } catch (e) {
    console.error(e);
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
};
