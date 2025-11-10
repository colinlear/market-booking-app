import type { Stall, StallStatus } from "@/types";
import {
  Box,
  Button,
  Center,
  Checkbox,
  CloseButton,
  Heading,
  IconButton,
  InputGroup,
  List,
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
import { LuMinus, LuPlus } from "react-icons/lu";
import { GoDot, GoPlus } from "react-icons/go";
import { auth } from "@/firebase/firebase";
import { BottomBar } from "@/common/bottom-bar";
import { SubHeader } from "@/common/subheader";

export const StallForm: FC<{
  stall?: Stall;
  stallStatus?: StallStatus;
  onSave: (stall: Stall) => void;
}> = ({ stall, stallStatus, onSave }) => {
  const market = useMarket();
  const isAdmin = useIsMarketAdmin();
  const canEditStall = !isAdmin || market.code == stall?.marketCode;

  const { addStall, loading } = useAddStall(onSave);
  const { editStall, loading: editLoading } = useEditStall(
    stall,
    canEditStall,
    onSave
  );

  const [email, setEmail] = useState(
    stall?.email ?? (!isAdmin ? auth.currentUser?.email ?? "" : "")
  );
  const [phone, setPhone] = useState(
    stall?.phone ?? (!isAdmin ? auth.currentUser?.phoneNumber ?? "" : "")
  );

  const [name, setName] = useState(stall?.name ?? "");
  const [description, setDesc] = useState(stall?.description ?? "");
  const [size, setSize] = useState(stallStatus?.size ?? "3x3");
  const [products, setProducts] = useState(stall?.products ?? []);
  const [newProduct, setNewProduct] = useState("");
  const [isFoodStall, setIsFood] = useState(stall?.isFoodStall ?? false);
  const [requiresPower, setRequiresPower] = useState(
    stallStatus?.requiresPower ?? false
  );
  const [requiresTent, setRequiresTent] = useState(
    stallStatus?.requiresTent ?? 0
  );
  const [notes, setNotes] = useState(stallStatus?.notes ?? "");

  return (
    <>
      {!canEditStall && (
        <SubHeader height="3.5rem" bgColor="fg.warning" color="white">
          <Center>
            <Box color="" m={0} fontSize="80%">
              Limited Access: Market Admin can only edit market specific fields.
            </Box>
          </Center>
        </SubHeader>
      )}
      <Stack gap={6} maxWidth="30rem">
        <Field.Root required>
          <Field.Label>
            Stall Name <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="Stall Name"
            defaultValue={name}
            onChange={(e) => setName(e.currentTarget.value)}
            readOnly={!canEditStall}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Stall Description</Field.Label>
          <Textarea
            value={description}
            placeholder="Stall Description"
            onChange={(e) => setDesc(e.currentTarget.value)}
            rows={5}
            readOnly={!canEditStall}
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
              readOnly={!canEditStall}
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
              readOnly={!canEditStall}
            />
          </Field.Root>
        )}

        <Field.Root invalid={products.includes(newProduct.trim())}>
          <Field.Label>Product(s)</Field.Label>
          <Stack pl={2} width="100%">
            {products.sort().map((p) => (
              <HStack key={p}>
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
              readOnly={!canEditStall}
            />
          </InputGroup>
        </Field.Root>

        <Field.Root>
          <Checkbox.Root defaultChecked={isFoodStall} readOnly={!canEditStall}>
            <Checkbox.HiddenInput
              onChange={(e) => setIsFood(e.currentTarget.checked)}
            />
            <Checkbox.Control />
            <Checkbox.Label>This stall sells food or drinks</Checkbox.Label>
          </Checkbox.Root>
          <Field.HelperText>
            Only applies when for human consumption.
          </Field.HelperText>
        </Field.Root>

        <Heading size="md" color="fg.info" mt={4}>
          Stall Properties for {market.name}.
        </Heading>
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

        {(market.powerCost ?? 0) > 0 && (!stall || !!stallStatus) && (
          <Checkbox.Root defaultChecked={requiresPower}>
            <Checkbox.HiddenInput
              onChange={(e) => setRequiresPower(e.currentTarget.checked)}
            />
            <Checkbox.Control />
            <Checkbox.Label>This stall requires electricity</Checkbox.Label>
          </Checkbox.Root>
        )}

        {(market.tentCost ?? 0) > 0 && (!stall || !!stallStatus) && (
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
        <Field.Root>
          <Field.Label>Special Requirements</Field.Label>
          <Textarea
            value={notes}
            placeholder="Special instructions, notes, comments etc."
            onChange={(e) => setNotes(e.currentTarget.value)}
            rows={5}
          />
          <Field.HelperText>
            For Example:
            <List.Root ml={4}>
              <List.Item>
                Preferred location, or location requirements.
              </List.Item>
              <List.Item>Parking next to, or near stall.</List.Item>
              <List.Item>
                Away from other stalls, like buskers, food, etc.
              </List.Item>
              <List.Item>Other...</List.Item>
            </List.Root>
          </Field.HelperText>
        </Field.Root>
        <BottomBar>
          <Button
            width="100%"
            colorPalette="teal"
            variant="solid"
            loading={loading || editLoading}
            onClick={() => {
              if (stall && email.trim()) {
                editStall(
                  {
                    ...stall,
                    email,
                    phone,
                    name,
                    description,
                    products,
                    isFoodStall,
                  },
                  stallStatus
                    ? {
                        ...stallStatus,
                        size,
                        requiresPower,
                        requiresTent,
                        notes,
                      }
                    : undefined
                );
              } else {
                addStall(
                  {
                    email,
                    phone,
                    name,
                    description,
                    products,
                    isFoodStall,
                  },
                  requiresPower,
                  requiresTent,
                  size,
                  notes
                );
              }
            }}
          >
            Save
          </Button>
        </BottomBar>
      </Stack>
    </>
  );
};
