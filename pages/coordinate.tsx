import { PrismaClient } from "@prisma/client";
import axios from "axios";
import Konva from "konva";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const getServerSideProps = async () => {
  const floors = await new PrismaClient().floor.findMany();
  const floor = floors[0];
  const coordinates = await new PrismaClient().coordinate.findMany({
    where: {
      floor_id: floor.id
    }
  })

  return { props: { floor, floors, coordinates } };
};

export default function Coordinate({ floor, floors, coordinates }: any) {
  const [mode, SetMode] = useState(true);
  const [name, SetName] = useState("");
  const [type, SetType] = useState("");
  const [x_cord, SetX] = useState("");
  const [y_cord, SetY] = useState("");
  const [crFloor, SetFloor] = useState(floor);
  const [crCoordinates, SetCoor] = useState(coordinates);

  const router = useRouter();

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
  });

  const submit = async (e: any) => {
    e.preventDefault();

    const formData = {
      name: name,
      type: type,
      x_cord: Number(x_cord),
      y_cord: Number(y_cord),
      floor_id: Number(crFloor.id),
    };
    await axios.post("/api/coordinate/create", formData).then(async (res) => {
      if (res.status == 200) {

        SetMode(true);
      } else {

      }
    });

    await axios.get("/api/coordinate/floor/" + crFloor.id).then(async (res) => {
      if (res.status == 200) {
        SetCoor(res.data.data)
        SetMode(true);
      } else {

      }
    });
  };

  const onDelete = async (id: number) => {
    await axios.post("/api/floor/delete/" + id.toString()).then(async (res) => {
      if (res.status == 200) {

        router.push("/floor");
        SetMode(true);
      }
    });
  };

  const changeFLoor = async (e: any) => {
    const id = e.target.value;
    await axios.get("/api/floor/read/" + id).then((res) => {
      if (res.status == 200) {
        SetFloor(res.data.data);
      }
    });

    await axios.get("api/coordinate/floor/"+id).then((coor) => {
      SetCoor([])
      SetCoor(coor.data.data)
    })
  };

  const changeMode = () => {
    if (mode) {
      return (
        <>
          <div className="container h-50 overflow-auto px-5">
            <ListCoordinate data={{ crCoordinates, crFloor }}></ListCoordinate>
          </div>
        </>
      );
    } else {
      return (
        <>
          <form className="mt-5 mx-5" onSubmit={submit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control rounded-pill border border-4 border-light bg-dark text-light px-4"
                id="name"
                placeholder="x"
                value={name}
                onChange={(e) => {
                  SetName(e.target.value);
                }}
                required
              />
              <label htmlFor="name">
                <div className="text-light fw-bold px-3">Name</div>
              </label>
            </div>
            <div className="mb-3">
              <select
                className="form-control rounded-pill border border-4 border-light bg-dark text-light px-4"
                id="role"
                placeholder="x"
                value={type}
                onChange={(e) => {
                  SetType(e.target.value);
                }}
                required
              >
                <option value="">Select role</option>
                <option value="TARGET">Target</option>
                <option value="NON_TARGET">Non Target</option>
              </select>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className="form-control rounded-pill border border-4 border-light bg-dark text-light px-4"
                    id="x"
                    placeholder="x"
                    value={x_cord}
                    onChange={(e) => {
                      SetX(e.target.value);
                    }}
                    required
                  />
                  <label htmlFor="x">
                    <div className="text-light fw-bold px-3">X</div>
                  </label>
                </div>
              </div>
              <div className="col">
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className="form-control rounded-pill border border-4 border-light bg-dark text-light px-4"
                    id="y"
                    placeholder="y"
                    value={y_cord}
                    onChange={(e) => {
                      SetY(e.target.value);
                    }}
                    required
                  />
                  <label htmlFor="y">
                    <div className="text-light fw-bold px-3">Y</div>
                  </label>
                </div>
              </div>
            </div>
            <div className="row gx-0">
              <button className="btn btn-primary rounded-5" type="submit">
                Add Floor
              </button>
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
          <div id="canvas" className="bg-light"></div>
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

          <div className="mx-5 mt-4 mb-4">
            <label htmlFor="floor mb-5">
              <div className="text-light fw-bold px-3">Current Floor</div>
            </label>
            <select
              className="form-control rounded-pill border border-4 border-light bg-dark text-light px-4"
              id="floor"
              placeholder="name@example.com"
              onChange={changeFLoor}
              required
            >
              <option value={floor.id}>{floor.name}</option>
              <ListFloor data={floors}></ListFloor>
            </select>
          </div>
          <hr className="border border-1 border-light" />

          <ul className="nav nav-pills nav-fill mx-5">
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
                Add Coordinate
              </button>
            </li>
          </ul>
          {changeMode()}
        </div>
      </div>
    </div>
  );
}

export function ListFloor({ data }: any) {

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
        <option value={e.id} key={e.id}>
          {e.name}
        </option>
      ))}
    </>
  );
}

export function ListCoordinate({ data }: any) {

  console.log(data);
  
  let floor: any = [];
  if (data.crCoordinates.lenght) {
    data.crCoordinates.forEach((e: any) => {
      floor.push();
    });
  } else {
    <div className="fs-5 text-center">No data.</div>;
  }

  return (
    <>
      {data.crCoordinates.map((e: any) => (
        <div className="row justify-content-center text-light text-center p-3" key={e.id}>
          <div className="col h4 fw-bold">{data.crFloor.name}</div>
          <div className="col h4 fw-bold text-primary">|</div>
          <div className="col fs-4 ">{e.name}</div>
        </div>
     
      )
      )}
    </>
  );
}
