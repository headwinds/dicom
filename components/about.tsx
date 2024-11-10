"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Link } from "cross-country";
import React from "react";

const About: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex justify-between w-full items-center m-1 p-2">
        <CardTitle className="text-[24px]">DICOM ArrayBuffer Parser</CardTitle>
        <div className="m-2">
          <Link url="https://www.github.com/headwinds/dicom">
            <GithubLogo size={32} color={"#000"} weight="light" />
          </Link>
        </div>
      </CardContent>
      <CardContent>
        <p className="mb-4">
          This application allows you to parse DICOM (Digital Imaging and
          Communications in Medicine) data from an Int32Array.
        </p>
        <p className="mb-4">To use this parser:</p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>
            From Chrome inspector, you can capture and copy the Int32Array to
            your clipboard and past it in the input. The Int32Array is one of
            several properties of the ArrayBuffer (review the store function
            from{" "}
            <Link url="https://github.com/OHIF/Viewers/blob/61e3a9cb528b16ff453e6e69659a3e92108e35f3/extensions/default/src/DicomWebDataSource/index.js#L4">
              <u>DicomWebDataSource</u>
            </Link>
            ).
          </li>
          <li>
            As soon as you paste the Int32Array, the parser will attempt to
            extract key DICOM tags and display them in a human-readable format.
          </li>
        </ol>
        <p>
          This can be useful for quickly inspecting DICOM data or for
          educational purposes in understanding DICOM structure.
        </p>
      </CardContent>
    </Card>
  );
};

export default About;
