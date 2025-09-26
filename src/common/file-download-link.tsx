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
    const storage = getStorage();
    getDownloadURL(ref(storage, path)).then((url) => {
      setUrl(url);
    });
  });

  if (!url) return null;
  return (
    <Link variant="underline" href={url} target="_blank">
      {children} <LuExternalLink />
    </Link>
  );
};
