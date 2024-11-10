"use client";

import { HeadwindsLogo, Link } from "cross-country";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import React from "react";

const Headwinds: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Headwinds is a solo software developer who is passionate about
          creating software that is both useful and fun to use.
        </p>
        <p>
          He shares the same name as the leader of Killers which murdered his
          SEO, and often gets his fan mail so you can probably guess his gmail
          address. He can still remember switching from Hotmail to{" "}
          <Link url="https://www.pbs.org/newshour/nation/20-years-ago-people-thought-googles-gmail-launch-was-an-april-fools-day-joke">
            Gmail in 2004
          </Link>
          to transfer a large file from New York to Toronto while attending a
          tech conference.
        </p>
        <p></p>
      </CardContent>
      <CardContent>
        <Link url="https://headwinds.vercel.app">
          <HeadwindsLogo />
        </Link>
      </CardContent>
    </Card>
  );
};

export default Headwinds;
