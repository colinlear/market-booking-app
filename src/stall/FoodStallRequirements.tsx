import type { Stall } from "@/types";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Input,
  Portal,
  Stack,
  type ButtonProps,
} from "@chakra-ui/react";
import { differenceInDays, format } from "date-fns";
import { useMemo, useState, type FC } from "react";
import { FileUploadInput } from "@/common/file-upload-input";
import { useUpdateStall } from "./useUpdateStall";
import { auth } from "@/firebase/firebase";
import { FileDownloadLink } from "@/common/file-download-link";

export const FoodStallRequirements: FC<{
  stall: Stall;
  onChange: () => void;
}> = ({ stall, onChange }) => {
  const [expireDate, expires] = useMemo(() => {
    const expDate = new Date(stall.insuranceExpires ?? NaN);
    if (isNaN(expDate.getTime())) return [undefined, -1];
    return [expDate, differenceInDays(expDate, new Date())];
  }, [stall]);

  if (!stall.isFoodStall) {
    return null;
  }

  return (
    <Stack gap={2} mt={4}>
      {stall.foodBusinessCert?.trim ? (
        <HStack justifyContent="space-between">
          <Box>
            <FileDownloadLink path={stall.foodBusinessCert}>
              Food Business Registration
            </FileDownloadLink>
          </Box>
          <FoodStallRegistrationDialog
            stall={stall}
            label="Update"
            button={{ colorPalette: "blue" }}
            onDone={onChange}
          />
        </HStack>
      ) : (
        <HStack justifyContent="space-between">
          <Box color="red" fontSize="90%">
            Missing Food Business Registration
          </Box>
          <FoodStallRegistrationDialog
            stall={stall}
            label="Upload"
            button={{ colorPalette: "red" }}
            onDone={onChange}
          />
        </HStack>
      )}
      {stall.foodBusinessInsurance?.trim && expires > 0 ? (
        <>
          <HStack justifyContent="space-between">
            <Box>
              <FileDownloadLink path={stall.foodBusinessInsurance}>
                Insurance Certificate
              </FileDownloadLink>
            </Box>
            <FoodStallInsuranceDialog
              stall={stall}
              label="Update"
              button={{ colorPalette: "blue" }}
              onDone={onChange}
            />
          </HStack>
          <Box fontSize="90%" textAlign="center">
            Insurance Expires in {expires} day{expires != 1 ? "s" : ""}. (
            {expireDate?.toLocaleDateString()})
          </Box>
        </>
      ) : (
        <HStack justifyContent="space-between">
          <Box color="red" fontSize="90%">
            Missing Valid Insurance Certificate
          </Box>
          <FoodStallInsuranceDialog
            stall={stall}
            label="Upload"
            button={{ colorPalette: "red" }}
            onDone={onChange}
          />
        </HStack>
      )}
    </Stack>
  );
};

export const FoodStallInsuranceDialog: FC<{
  stall: Stall;
  label: string;
  button?: ButtonProps;
  onDone: () => void;
}> = ({ stall, label = "Upload", button, onDone }) => {
  const { editStall, loading } = useUpdateStall(stall.id, () => {
    setOpen(false);
    onDone();
  });
  const [open, setOpen] = useState(false);
  const [insuranceExpires, setInsuranceExpires] = useState<string | undefined>(
    stall.insuranceExpires
  );
  const [insuranceCertificate, setInsuranceCertificate] = useState<
    string | undefined
  >(stall.foodBusinessInsurance);

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button
          {...button}
          disabled={stall.email !== auth.currentUser?.email}
          size="sm"
        >
          {label}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Food Stall Insurance</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={2}>
                <Box>Insurance must be for $20,000,000 and current.</Box>
                <FileUploadInput
                  filepath={`docs/${stall.id}/insurance-${format(
                    new Date(),
                    "yyyy-MM-dd"
                  )}`}
                  onChange={(f) => setInsuranceCertificate(f)}
                >
                  Insurance Certificate
                </FileUploadInput>
                <Field.Root required>
                  <Field.Label>
                    Insurance Expiry Date <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    type="date"
                    placeholder="Insurance Expiry Date"
                    defaultValue={insuranceExpires}
                    onChange={(e) => setInsuranceExpires(e.currentTarget.value)}
                  />
                  <Field.HelperText>
                    Please Ensure expiry date provided matches the certificate.
                  </Field.HelperText>
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button colorPalette="red">Cancel</Button>
              </Dialog.ActionTrigger>

              <Button
                colorPalette="green"
                disabled={!insuranceExpires || !insuranceCertificate}
                loading={loading}
                onClick={async (e) => {
                  e.stopPropagation();
                  editStall({
                    insuranceExpires,
                    foodBusinessInsurance: insuranceCertificate,
                  });
                }}
              >
                Save
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export const FoodStallRegistrationDialog: FC<{
  stall: Stall;
  label: string;
  button?: ButtonProps;
  onDone: () => void;
}> = ({ stall, label = "Upload", button, onDone }) => {
  const { editStall, loading } = useUpdateStall(stall.id, () => {
    setOpen(false);
    onDone();
  });
  const [open, setOpen] = useState(false);

  const [businessCertificate, setBusinessCertificate] = useState<
    string | undefined
  >(stall.foodBusinessCert);

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button
          {...button}
          disabled={stall.email !== auth.currentUser?.email}
          size="sm"
        >
          {label}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Food Stall Documentation</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={2}>
                <FileUploadInput
                  filepath={`docs/${stall.id}/business-cert-${format(
                    new Date(),
                    "yyyy-MM-dd"
                  )}`}
                  onChange={(f) => setBusinessCertificate(f)}
                >
                  Food Business Registration
                </FileUploadInput>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button colorPalette="red">Cancel</Button>
              </Dialog.ActionTrigger>

              <Button
                colorPalette="green"
                disabled={!businessCertificate}
                loading={loading}
                onClick={async (e) => {
                  e.stopPropagation();
                  editStall({
                    foodBusinessCert: businessCertificate,
                  });
                }}
              >
                Save
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
