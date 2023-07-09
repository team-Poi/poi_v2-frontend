/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import requestIP from "request-ip";
import axios from "axios";
import Header from "@/components/header";
import { Garo, Saero, FullFlex } from "@/components/ui";
import { useEffect, useState } from "react";
import Head from "next/head";
import Features from "@/components/features";

interface HomeProps {
  ip: string;
  countryCode?: string;
  countryName?: string;
}
export default function Home(props: HomeProps) {
  let [imageURL, setImageURL] = useState("");
  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/alpha/${props.countryCode}`)
      .then((v) => {
        let { data } = v;
        setImageURL(data[0].flags.svg);
      });
  }, [props.countryCode]);
  return (
    <>
      <Saero
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        <Head>
          <title>poi.kr / My ip adress</title>
        </Head>
        <Header type="IP" />
        <FullFlex>
          <Saero
            style={{
              justifyContent: "center",
              alignContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                margin: "0px",
              }}
            >
              Your ip adress is
            </h3>
            <h1
              style={{
                textAlign: "center",
                margin: "0px",
                marginBottom: "1rem",
              }}
            >
              <strong>{props.ip}</strong>
            </h1>
            {props.countryName && (
              <Garo
                gap={4}
                style={{
                  textAlign: "center",
                  margin: "0px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>You are on</span>
                {imageURL.length > 0 && (
                  <img
                    alt={props.countryCode}
                    src={imageURL}
                    style={{
                      borderRadius: "5px",
                      width: "3em",
                      height: "3em",
                    }}
                  />
                )}
                <strong>{props.countryName}</strong>.
              </Garo>
            )}
          </Saero>
        </FullFlex>
      </Saero>
      <Features />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  let ipAdress = requestIP.getClientIp(context.req);
  if (!ipAdress) return { props: { ip: "Unknown" } };
  ipAdress = ipAdress.replace("::ffff:", "");
  const ipLocAPIRES = await axios.get(
    `https://api.iplocation.net/?ip=${ipAdress}`
  );
  const ipLoc = ipLocAPIRES.data as {
    ip: string;
    ip_number: string;
    ip_version: string;
    country_name: string;
    country_code2: string;
    isp: string;
    response_code: string;
    response_message: string;
  };
  return {
    props: {
      ip: ipAdress,
      countryCode: ipLoc.country_code2,
      countryName: ipLoc.country_name,
    },
  };
};
