/* eslint-disable array-callback-return */
import "./MainPage.css";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Navbar from "../../components/Navbar";
import MyBooks from "./MyBooks";
import { useCollection } from "../../hooks/useCollection";
import Book from "./Book";

export default function MainPage() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);

  const searchFnc = (x) => {
    if (x.key === "Enter") {
      axios
        .get(
          "https://www.googleapis.com/books/v1/volumes?q=" +
            search +
            "&key=AIzaSyBuQdEbqltUG2e4Y4dcM-uO3QOjQJjdPdk&maxResults=40"
        )
        .then((res) => setResult(res.data.items))
        .catch((err) => console.log(err));
    }
  };

  const { document } = useCollection("books");

  useEffect(() => {
    console.log("useEffect");
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <Sidebar />
        <div className="main-page">
          <section className="search-bar">
            <div className="wrapper">
              <input
                className="input"
                placeholder="Search here..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                onKeyUp={searchFnc}
              />
              <button className="fa">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </section>

          <section className="book-section">
            {result &&
              result.map((book) => (
                <Book book={book} />
              ))}
          </section>

          <section className="my-books">
            <MyBooks project={document} />
          </section>
        </div>
      </div>
    </>
  );
}
