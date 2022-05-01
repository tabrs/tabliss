import React, { useState } from "react";
import { useCachedEffect } from "../../../hooks";
import { getJoke } from "./api";
import "./Joke.sass";
import {
  defaultData,
  Props,
  isSingleJoke,
  isTwoPartJoke,
  TwoPartJokeAPIResponse,
  isJokeError,
} from "./types";

const Joke: React.FC<Props> = ({
  cache,
  data = defaultData,
  setCache,
  loader,
}) => {
  useCachedEffect(
    () => {
      getJoke(loader, data.category, data.includeNSFW).then(setCache);
    },
    0,
    [data.category],
  );

  if (!cache) {
    return null;
  }

  if (isJokeError(cache)) {
    return (
      <>
        {cache.causedBy.map((errorMessage, index) => {
          return <p key={index}>{errorMessage}</p>;
        })}
      </>
    );
  }

  return (
    <div className="joke-container">
      {isSingleJoke(cache) && <h5>{cache.joke}</h5>}

      {isTwoPartJoke(cache) && <TwoPartJoke joke={cache} />}
    </div>
  );
};

const TwoPartJoke: React.FC<{ joke: TwoPartJokeAPIResponse }> = ({ joke }) => {
  const isJokeAQuestion = joke.setup.slice(-1) === "?";
  const [showAnswer, setShowAnswer] = useState(false);

  if (!isJokeAQuestion) {
    return (
      <>
        <h5>{joke.setup}</h5>
        <p>. . .</p>
        <h5>{joke.delivery}</h5>
      </>
    );
  }

  return (
    <>
      <h5
        className="question-joke-setup"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        {joke.setup}
      </h5>
      {showAnswer && (
        <h5 className="question-joke-delivery">{joke.delivery}</h5>
      )}
    </>
  );
};

export default Joke;
