import React from "react";

export default function list_floors() {
  return (
    <div className="row justify-content-center text-light text-center p-3">
      <div className="col h4 fw-bold">Lantai 1</div>
      <div className="col">
        <div className="row fs-4">
          <button className="btn btn-light col" type="button">
            <i className="bi bi-pencil-fill"></i>
          </button>
          <div className="col h4 fw-bold">|</div>
          <button className="btn btn-danger col" type="button">
            <i className="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
