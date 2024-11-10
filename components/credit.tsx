"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paragraph, HeadwindsLogo, Link } from "cross-country";

import React from "react";
// import brandon from './brandon_square.png';

const Headwinds: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Headwinds is a solo software developer who is passionate about
          creating software that is both useful and fun to use.
        </p>
        <p>
          He shares the same name as the leader of Killers which murdered his
          SEO, and often get his fan mail so you can guess his gmail address.
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
