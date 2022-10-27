import React, { useState, useEffect, useRef } from "react";
import "./InfiniteScroll.css";
import { v4 as uuidv4 } from "uuid";

export default function InfiniteScroll() {
  // les 3 sous-tableaux correspondent aux 3 colonnes dans la div "card-list" (3 colonnes comme le site unsplash)
  const [dataImg, setDataImg] = useState([[], [], []]);
  // lors du scroll vers le bas : on ira sur une autre page et on commencera à la page 1
  const [pageIndex, setPageIndex] = useState(1);
  // utilisation de la barre de recherche, random = image aléatoire
  const [searchState, setSearchState] = useState("random");

  const [firstCall, setFirstCall] = useState(true);

  const infiniteFetchData = () => {
    fetch(
      `https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchState}&client_id=7oZL5F89Ekv4THZATbohtpfQ432Smo0Exl307rZeyyk`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const imgsReceived = [];

        data.results.forEach((img) => {
          imgsReceived.push(img.urls.regular);
        });

        const newFreshState = [
          [...dataImg[0]],
          [...dataImg[1]],
          [...dataImg[2]],
        ];
        // index qui va aller de 0 à 29 qui va pour voir dire que newFreshState[i] va recevoir image de index (image 0,1,2,3 etc... jusque 29)
        let index = 0;
        // i < 3 : les 3 sous-tableaux
        for (let i = 0; i < 3; i++) {
          // j < 10 : remplissage de 9 images par sous-tableau
          for (let j = 0; j < 10; j++) {
            newFreshState[i].push(imgsReceived[index]);
            index++;
          }
        }

        setDataImg(newFreshState);
        setFirstCall(false);
      });
  };

  const searchFetchData = () => {
    fetch(
      `https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchState}&client_id=7oZL5F89Ekv4THZATbohtpfQ432Smo0Exl307rZeyyk`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const imgsReceived = [];

        data.results.forEach((img) => {
          imgsReceived.push(img.urls.regular);
        });

        const newFreshState = [[], [], []];
        // index qui va aller de 0 à 29 qui va pour voir dire que newFreshState[i] va recevoir image de index (image 0,1,2,3 etc... jusque 29)
        let index = 0;
        // i < 3 : les 3 sous-tableaux
        for (let i = 0; i < 3; i++) {
          // j < 10 : remplissage de 9 images par sous-tableau
          for (let j = 0; j < 10; j++) {
            newFreshState[i].push(imgsReceived[index]);
            index++;
          }
        }

        setDataImg(newFreshState);
      });
  };

  // console.log(dataImg);

  // à chaque fois que searchState va changer, que la fonction handleSearch est appelée, ça va trigger searchFetchData
  // lancer que lorque recherche (firstCall)
  useEffect(() => {
    if (firstCall) return;
    searchFetchData();
  }, [searchState]);

  // Uniquement appelé une 1ere fois
  useEffect(() => {
    infiniteFetchData();
  }, [pageIndex]);

  const handleSearch = (e) => {
    e.preventDefault();

    setSearchState(inputRef.current.value);
    setPageIndex(1);
  };

  const inputRef = useRef();

  useEffect(() => {
    window.addEventListener("scroll", infiniteCheck);

    return () => {
      window.removeEventListener("scroll", infiniteCheck);
    };
  }, []);

  const infiniteCheck = () => {
    // console.log('Hello Check!');
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollHeight - scrollTop <= clientHeight) {
      // console.log("BOTTOM");
      // si on touche le "fond" de la page, pageIndex change avec +1 = lancement de infiniteFetchData qui va hydrater de nouveaux tableaux avec d'autres images
      setPageIndex((pageIndex) => pageIndex + 1);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSearch}>
        <label htmlFor="search">Votre recherche</label>
        <input type="text" id="search" ref={inputRef} />
      </form>

      <div className="card-list">
        <div>
          {dataImg[0].map((img) => {
            return <img key={uuidv4()} src={img} alt="clone unsplash"></img>;
          })}
        </div>
        <div>
          {dataImg[1].map((img) => {
            return <img key={uuidv4()} src={img} alt="clone unsplash"></img>;
          })}
        </div>
        <div>
          {dataImg[2].map((img) => {
            return <img key={uuidv4()} src={img} alt="clone unsplash"></img>;
          })}
        </div>
      </div>
    </div>
  );
}
