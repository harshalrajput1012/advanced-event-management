import { useEffect, useState } from "react";
import { apiError } from "../services/api";

export function useAsync(factory, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    factory()
      .then((value) => mounted && setData(value))
      .catch((err) => mounted && setError(apiError(err)))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error, setData };
}
