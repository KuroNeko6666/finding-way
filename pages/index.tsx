import { PrismaClient } from "@prisma/client";
import Konva from "konva";
import Link from "next/link";
import { useEffect, useState } from "react";

export const getServerSideProps = async () => {
  const posts = await new PrismaClient().coordinate.findMany({
    include: {
      floor: true
    }
  });
  return { props: { posts } };
};

export default function Home({posts} :any) {

  const [coordinates, setCoor] = useState(posts);

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
        y: window.innerHeight / 4,
        image: BgImage,
        width: (window.innerWidth / 12) * 8,
        height: BgImage.height - 300,
      });
      Bg.add(img);
    };
    BgImage.src = "/img/map.png";
  }, []);

  const submit = () => {};

  return (
    <div className="container-fluid p-0">
      <div className="row gx-0">
        <div className="col-1 bg-dark"></div>
        <div className="col-8">
          <div id="canvas" className="bg-light"></div>
        </div>
        <div className="col-3 bg-dark" style={{ height: "100vh" }}>
          <div className="mx-5 mt-3 row justify-content-end">
            <div className="dropdown col-1">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-gear-fill"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link href={"/floor"} legacyBehavior>
                    <a className="dropdown-item" href="#">
                      Setup Floor
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={"/coordinate"} legacyBehavior>
                    <a className="dropdown-item" href="#">
                      Setup Coordinate
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={"/start"} legacyBehavior>
                    <a className="dropdown-item" href="#">
                      Setup Start Point
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/*============= Search ============== */}

          <div className="form-floating mx-5 mt-5 mb-4">
            <input
              type="Name"
              className="form-control rounded-pill border border-4 border-light bg-dark text-light px-4"
              id="floatingInput"
              placeholder="name@example.com"
              required
            />
            <label htmlFor="floatingInput ">
              <div className="text-light fw-bold px-3">
                <i className="bi bi-search"></i> Search
              </div>
            </label>
          </div>
          <hr className="border border-1 border-light" />

          {/*============= Recent target ============== */}

          <div
            id="carouselExampleControls"
            className="carousel slide my-4"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner px-5">
              <div className="carousel-item active">
                {/*============= Item Recent ============== */}

                <div className="row justify-content-center align-items-center text-center text-light px-5">
                  <div className="col">
                    <div className="row h1">
                      <i className="bi bi-search"></i>
                    </div>
                    <div className="row">
                      <div className="fs-6">search</div>
                    </div>
                  </div>
                  <div className="col text-light">
                    <div className="row h1">
                      <i className="bi bi-badge-wc-fill"></i>
                    </div>
                    <div className="row">
                      <div className="fs-6">Toilet</div>
                    </div>
                  </div>
                  <div className="col text-light">
                    <div className="row h1">
                      <i className="bi bi-bag-fill"></i>
                    </div>
                    <div className="row">
                      <div className="fs-6">Bag</div>
                    </div>
                  </div>
                  <div className="col text-light">
                    <div className="row h1">
                      <i className="bi bi-chat-dots-fill"></i>
                    </div>
                    <div className="row">
                      <div className="fs-6">CS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          <hr className="border border-1 border-light" />

          <ul className="nav nav-pills nav-fill mx-5 mb-3">
            <li className="nav-item">
              <a
                className="nav-link active rounded-5"
                aria-current="page"
                href="#"
              >
                A-Z
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="#">
                Floor
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="#">
                Category
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="#">
                Popular
              </a>
            </li>
          </ul>

          <div className="container h-50 overflow-auto px-5">
            <ListCoordinate data={coordinates}></ListCoordinate>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListCoordinate({ data }: any) {
  let floor: any = [];
  if (data.lenght) {
    data.forEach((e: any) => {
      floor.push();
    });
  } else {
    <div className="fs-5 text-center">No data.</div>;
  }

  return (
    <>
      {data.map((e: any) => (
        <div
          className="row justify-content-center text-light text-center p-3"
          key={e.id}
        >
          <div className="col h4 fw-bold">{e.floor.name}</div>
          <div className="col h4 fw-bold text-primary">|</div>
          <div className="col fs-4 ">{e.name}</div>
        </div>
      ))}
    </>
  );
}
