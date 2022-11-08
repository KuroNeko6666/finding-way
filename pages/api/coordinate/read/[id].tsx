// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Coordinate, Floor, Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

type Data = {
  status: number;
  message: string;
  data: Coordinate | string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;
  try {
    const floor = await prisma.coordinate.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (floor) {
      return res.status(200).json({
        status: 200,
        message: "success",
        data: floor,
      });
    } else {
      return res.status(401).json({
        status: 401,
        message: "fail",
        data: "not found",
      });
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(500).json({
          status: 500,
          message: "fail",
          data: e.code,
        });
      }
      return res.status(500).json({
        status: 500,
        message: "fail",
        data: e.code,
      });
    }
  }
}
