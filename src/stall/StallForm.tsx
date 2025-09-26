import type { Stall } from "@/types";
import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  FileUpload,
  IconButton,
  InputGroup,
  NumberInput,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react/field";
import { Input } from "@chakra-ui/react/input";
import { HStack, Stack } from "@chakra-ui/react/stack";
import { useState, type FC } from "react";
import { useAddStall } from "./useAddStall";
import { useEditStall } from "./useEditStall";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";
import { LuFileUp, LuMinus, LuPlus } from "react-icons/lu";
import { GoDot, GoPlus } from "react-icons/go";
import { auth } from "@/firebase/firebase";

export const StallForm: FC<{
  stall?: Stall;
  onSave: (stall: Stall) => void;
}> = ({ stall, onSave }) => {
  const market = useMarket();
  const isAdmin = useIsMarketAdmin();

  const { addStall, loading } = useAddStall(onSave);
  const { editStall, loading: editLoading } = useEditStall(stall, onSave);

  const [email, setEmail] = useState(
    stall?.email ?? !isAdmin ? auth.currentUser?.email ?? "" : ""
  );
  const [phone, setPhone] = useState(
    stall?.phone ?? !isAdmin ? auth.currentUser?.phoneNumber ?? "" : ""
  );

  const [name, setName] = useState(stall?.name ?? "");
  const [description, setDesc] = useState(stall?.description ?? "");
  const [size, setSize] = useState(stall?.size ?? "3x3");
  const [products, setProducts] = useState(stall?.products ?? []);
  const [newProduct, setNewProduct] = useState("");
  const [isFoodStall, setIsFood] = useState(stall?.isFoodStall ?? false);
  const [requiresPower, setRequiresPower] = useState(
    stall?.requiresPower ?? false
  );
  const [requiresTent, setRequiresTent] = useState(stall?.requiresTent ?? 0);
  const [insuranceExpires, setInsuranceExpires] = useState(
    stall?.insuranceExpires
  );

  return (
    <Stack gap={6}>
      <Field.Root required>
        <Field.Label>
          Stall Name <Field.RequiredIndicator />
        </Field.Label>
        <Input
          placeholder="Stall Name"
          defaultValue={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Stall Description</Field.Label>
        <Textarea
          value={description}
          placeholder="Stall Description"
          onChange={(e) => setDesc(e.currentTarget.value)}
          rows={5}
        />
      </Field.Root>
      {isAdmin && (
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input
            type="email"
            value={email}
            placeholder="Email Address"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </Field.Root>
      )}
      {isAdmin && (
        <Field.Root>
          <Field.Label>Phone</Field.Label>
          <Input
            type="tel"
            value={phone}
            placeholder="Phone Number"
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
        </Field.Root>
      )}

      <Field.Root>
        <Field.Label>Stall Size</Field.Label>
        <Input
          placeholder="Stall Size"
          defaultValue={size}
          onChange={(e) => setSize(e.currentTarget.value)}
        />
        <Field.HelperText>
          Size of stall in metres. Standard size is 3x3.
        </Field.HelperText>
      </Field.Root>

      <Field.Root invalid={products.includes(newProduct.trim())}>
        <Field.Label>Product(s)</Field.Label>
        <Stack pl={2} width="100%">
          {products.sort().map((p) => (
            <HStack>
              <GoDot />
              <Box flex={1}>{p}</Box>
              <CloseButton
                size="xs"
                onClick={() =>
                  setProducts((prev) => prev.filter((pn) => pn != p))
                }
              />
            </HStack>
          ))}
        </Stack>
        <InputGroup
          endAddon={
            <GoPlus
              onClick={() => {
                if (
                  newProduct.trim() &&
                  !products.includes(newProduct.trim())
                ) {
                  setProducts((p) => [...p, newProduct.trim()]);
                  setNewProduct("");
                }
              }}
            />
          }
        >
          <Input
            value={newProduct}
            onChange={(e) => setNewProduct(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (
                  newProduct.trim() &&
                  !products.includes(newProduct.trim())
                ) {
                  setProducts((p) => [...p, newProduct.trim()]);
                  setNewProduct("");
                  e.preventDefault();
                  e.stopPropagation();
                }
              }
            }}
          />
        </InputGroup>
      </Field.Root>

      <Checkbox.Root defaultChecked={isFoodStall}>
        <Checkbox.HiddenInput
          onChange={(e) => setIsFood(e.currentTarget.checked)}
        />
        <Checkbox.Control />
        <Checkbox.Label>This stall sells food or drinks</Checkbox.Label>
      </Checkbox.Root>

      {isFoodStall && (
        <>
          <FileUpload.Root gap="1">
            <FileUpload.HiddenInput />
            <FileUpload.Label>Food Business Certificate</FileUpload.Label>
            <InputGroup
              startElement={<LuFileUp />}
              endElement={
                <FileUpload.ClearTrigger asChild>
                  <CloseButton
                    me="-1"
                    size="xs"
                    variant="plain"
                    focusVisibleRing="inside"
                    focusRingWidth="2px"
                    pointerEvents="auto"
                  />
                </FileUpload.ClearTrigger>
              }
            >
              <Input asChild>
                <FileUpload.Trigger>
                  <FileUpload.FileText lineClamp={1} />
                </FileUpload.Trigger>
              </Input>
            </InputGroup>
          </FileUpload.Root>

          <FileUpload.Root gap="1">
            <FileUpload.HiddenInput />
            <FileUpload.Label>Insurance Certificate</FileUpload.Label>
            <InputGroup
              startElement={<LuFileUp />}
              endElement={
                <FileUpload.ClearTrigger asChild>
                  <CloseButton
                    me="-1"
                    size="xs"
                    variant="plain"
                    focusVisibleRing="inside"
                    focusRingWidth="2px"
                    pointerEvents="auto"
                  />
                </FileUpload.ClearTrigger>
              }
            >
              <Input asChild>
                <FileUpload.Trigger>
                  <FileUpload.FileText lineClamp={1} />
                </FileUpload.Trigger>
              </Input>
            </InputGroup>
          </FileUpload.Root>
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
              Insurance must be for $20,000,000 and current.
            </Field.HelperText>
          </Field.Root>
        </>
      )}

      {(market.powerCost ?? 0) > 0 && (
        <Checkbox.Root defaultChecked={requiresPower}>
          <Checkbox.HiddenInput
            onChange={(e) => setRequiresPower(e.currentTarget.checked)}
          />
          <Checkbox.Control />
          <Checkbox.Label>This stall requires electricity</Checkbox.Label>
        </Checkbox.Root>
      )}

      {(market.tentCost ?? 0) > 0 && (
        <Field.Root>
          <Field.Label>Requires Tent(s)</Field.Label>
          <NumberInput.Root
            unstyled
            spinOnPress={false}
            allowMouseWheel
            value={`${requiresTent}`}
            onValueChange={(e) => {
              setRequiresTent(e.valueAsNumber);
            }}
            min={0}
            max={isAdmin ? 5 : 2}
          >
            <HStack gap="2">
              <NumberInput.DecrementTrigger asChild>
                <IconButton
                  variant="outline"
                  size="sm"
                  backgroundColor="bg.panel"
                >
                  <LuMinus />
                </IconButton>
              </NumberInput.DecrementTrigger>
              <NumberInput.Input
                textAlign="center"
                backgroundColor="bg.panel"
                maxW="3rem"
                fontSize="lg"
              />

              <NumberInput.IncrementTrigger asChild>
                <IconButton
                  variant="outline"
                  size="sm"
                  backgroundColor="bg.panel"
                >
                  <LuPlus />
                </IconButton>
              </NumberInput.IncrementTrigger>
            </HStack>
          </NumberInput.Root>
        </Field.Root>
      )}

      <Button
        colorPalette="teal"
        variant="solid"
        loading={loading || editLoading}
        onClick={() => {
          if (stall && email.trim()) {
            editStall({
              ...stall,
              email,
              phone,
              name,
              description,
              products,
              size,
              isFoodStall,
              requiresPower,
              requiresTent,
            });
          } else {
            addStall({
              email,
              phone,
              name,
              description,
              products,
              size,
              isFoodStall,
              requiresPower,
              requiresTent,
            });
          }
        }}
      >
        Save
      </Button>
    </Stack>
  );
};
