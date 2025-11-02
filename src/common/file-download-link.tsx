import { Link } from "@chakra-ui/react";
import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { LuExternalLink } from "react-icons/lu";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const FileDownloadLink: FC<{ path?: string } & PropsWithChildren> = ({
  path,
  children,
}) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (path) {
      const storage = getStorage();
      getDownloadURL(ref(storage, path))
        .then((url) => {
          setUrl(url);
        })
        .catch((e) => console.error(path, e));
    }
  });

  if (!url) return children;
  return (
    <Link variant="underline" href={url} target="_blank">
      {children} <LuExternalLink />
    </Link>
  );
};
