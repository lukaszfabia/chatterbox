import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="md:px-52 px-40">{children}</div>;
}
