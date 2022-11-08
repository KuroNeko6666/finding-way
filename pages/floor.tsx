import { prisma, PrismaClient } from "@prisma/client";
import axios from "axios";
import Konva from "konva";
import { NextApiRequest } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";

export const getServerSideProps = async () => {
  const posts = await new PrismaClient().floor.findMany();
  return { props: { posts } };
};

export default function Floor({posts} : any) {
  const [mode, SetMode] = useState(true);
  const [name, SetName] = useState("");
  const [floors, SetFloors] = useState();
  const router = useRouter()

  const submit = async (e: any) => {
    e.preventDefault();
    const DataName = name;

    const formData = { name: name };

    const data = await axios.post("/api/floor/create", formData).then(async (res) => {
      if(res.status == 200){
        router.push("/floor")
        SetMode(true);
      }
    });
    ;
  };

  const onDelete = async (id: number) => {
    const data = await axios.post("/api/floor/delete/" + id.toString()).then(async (res) => {
      if(res.status == 200){
        console.log(res);
        
        router.push("/floor")
        SetMode(true);
      }
    });
  }

  const ChangeName = (e: any) => {
    SetName(e.target.value);
  };

  const changeMode = () => {
    if (mode) {
      return <ListFloor data={{ posts, onDelete }}></ListFloor>;
    } else {
      return (
        <>
          <form className="mt-5 mx-5" method="post" onSubmit={submit}>
            <div className="form-floating mb-3">
              <input
                name="name"
                type="text"
                className="form-control rounded-pill border border-4 border-light bg-dark text-light px-4"
                id="name"
                placeholder="x"
                value={name}
                onChange={ChangeName}
                required
              />
              <label htmlFor="name">
                <div className="text-light fw-bold px-3">Name</div>
              </label>
            </div>

            <div className="row gx-0">
              <button className="btn btn-primary rounded-5">Add Floor</button>
            </div>
          </form>
        </>
      );
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row gx-0">
        <div className="col-1 bg-dark"></div>
        <div className="col-8">
          <Map></Map>
        </div>
        <div className="col-3 bg-dark" style={{ height: "100vh" }}>
          <div className="mx-5 mt-3 row justify-content-end">
            <div className="dropdown col-1">
              <Link href={"/"}>
                <button className="btn btn-light" type="button">
                  <i className="bi bi-arrow-left-circle-fill"></i>
                </button>
              </Link>
            </div>
          </div>
          <ul className="nav nav-pills nav-fill mx-5 mt-5">
            <li className="nav-item">
              <button
                className={mode ? "nav-link active rounded-5" : "nav-link"}
                onClick={() => {
                  SetMode(true);
                }}
              >
                List Floor
              </button>
            </li>
            <li className="nav-item">
              <button
                className={!mode ? "nav-link active rounded-5" : "nav-link"}
                onClick={() => {
                  SetMode(false);
                }}
              >
                Add Floor
              </button>
            </li>
          </ul>
          {changeMode()}
        </div>
      </div>
    </div>
  );
}

export function Map() {
  useEffect(() => {
    let Stage = new Konva.Stage({
      container: "canvas",
      width: (window.innerWidth / 12) * 8,
      height: window.innerHeight,
    });

    let Bg = new Konva.Layer();
    Stage.add(Bg);

    let BgImage = new Image();
    BgImage.onload = () => {
      let img = new Konva.Image({
        x: 0,
        y: 0,
        image: BgImage,
        width: (window.innerWidth / 12) * 8,
        height: BgImage.height,
      });
      Bg.add(img);
    };
    BgImage.src = "/img/map.png";
  }, []);

  return <div id="canvas" className="bg-light"></div>;
}

export function ListFloor({ data }: any) {
  let floor: any = [];
  if (data.posts.lenght) {
    data.posts.forEach((e: any) => {
      floor.push();
    });
  } else {
    <div className="fs-5 text-center">No data.posts.</div>;
  }

  console.log(data.posts);

  return (
    <>
      {/*============= Search ============== */}
      <div className="form-floating mx-5 mt-4 mb-4">
        <input
          type="text"
          className="form-control rounded-pill border border-4 border-light bg-dark text-light px-4"
          id="search"
          placeholder="name@example.com"
          required
        />
        <label htmlFor="search">
          <div className="text-light fw-bold px-3">
            <i className="bi bi-search"></i> Search
          </div>
        </label>
      </div>
      <hr className="border border-1 border-light" />

      <div className="container h-50 overflow-auto px-5">
        {data.posts.map((e: any) => 
            // eslint-disable-next-line react/jsx-key
            <div className="row justify-content-center text-light text-center p-3" key={e.id}>
              <div className="col h4 fw-bold">{e.name}</div>
              <div className="col">
                <div className="row fs-4">
                  <div className="col h4 fw-bold">|</div>
                  <button className="btn btn-danger col" type="button" onClick={(ev)=>{data.onDelete(e.id)}}>
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
    </>
  );
}
