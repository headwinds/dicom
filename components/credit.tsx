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
        <div className="flex items-center gap-2">
          <p>
            <span className="font-serif">
              <i>Whipped up by Headwinds</i>
            </span>
          </p>
          <Link url="https://headwinds.vercel.app">
            <HeadwindsLogo />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Headwinds;
