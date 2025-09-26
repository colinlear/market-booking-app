import { Box, FileUpload, Icon, Skeleton } from "@chakra-ui/react";
import { useState, type FC, type PropsWithChildren } from "react";
import { LuUpload } from "react-icons/lu";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export const FileUploadInput: FC<
  {
    filepath: string;
    onChange: (filename: string) => void;
  } & PropsWithChildren
> = ({ filepath, children, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [filename, setFilename] = useState<string>();

  return (
    <FileUpload.Root alignItems="stretch" maxFiles={10}>
      <FileUpload.HiddenInput
        onChange={async (e) => {
          const storage = getStorage();
          const file = e.target.files?.[0];

          // console.debug("File", file);
          if (file?.name) {
            setUploading(true);
            try {
              const ext = file.name.split(".").pop();
              const fileRef = ref(storage, `${filepath}.${ext}`);
              const ret = await uploadBytes(fileRef, file);
              // console.debug("Cloud File", ret.ref.fullPath);
              onChange(ret.ref.fullPath);
              setFilename(file.name);
            } finally {
              setUploading(false);
            }
          }
        }}
      />
      <Skeleton asChild loading={uploading} colorPalette="blue">
        <FileUpload.Dropzone>
          <Icon size="md" color="fg.muted">
            <LuUpload />
          </Icon>
          <FileUpload.DropzoneContent>
            <FileUpload.Label>{children}</FileUpload.Label>
            {filename ? (
              <Box color="fg.muted">{filename}</Box>
            ) : (
              <>
                <Box>Drag and drop files here</Box>
                <Box color="fg.muted">.pdf, .doc, .jpg, png up to 5MB</Box>
              </>
            )}
          </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
        <FileUpload.List />
      </Skeleton>
    </FileUpload.Root>
  );
};
