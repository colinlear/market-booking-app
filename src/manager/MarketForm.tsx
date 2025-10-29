import type { Market } from "@/types";
import {
  Box,
  Button,
  CloseButton,
  Field,
  HStack,
  IconButton,
  Input,
  InputGroup,
  NumberInput,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useState, type FC } from "react";
import { useEditMarket } from "./useEditMarket";
import { LuMinus, LuPlus } from "react-icons/lu";
import { BottomBar } from "@/common/bottom-bar";
import { GoDot, GoPlus } from "react-icons/go";
import { StripeConnectButton } from "./StripeConnectButton";
import { useNavigate } from "react-router";

export const MarketForm: FC<{
  market?: Market;
  onSave: (market: Market) => void;
}> = ({ market, onSave }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState(market?.code ?? "");
  const [name, setName] = useState(market?.name ?? "");
  const [description, setDesc] = useState(market?.description ?? "");
  const [logo, setLogo] = useState(market?.logo ?? "");
  const [stallCost, setStallCost] = useState(market?.stallCost ?? 0);
  const [powerCost, setPowerCost] = useState(market?.powerCost ?? 0);
  const [tentCost, setTentCost] = useState(market?.tentCost ?? 0);
  const [admins, setAdmins] = useState(market?.admins ?? []);
  const [newAdmin, setNewAdmin] = useState("");

  const { editMarket, loading } = useEditMarket((m) => {
    onSave(m);
  });
  return (
    <Stack gap={2} maxWidth="30rem">
      {!market && (
        <Field.Root
          required
          invalid={!!code.length && !/^[A-Za-z0-9]$/.exec(code)}
        >
          <Field.Label>
            Market Code <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="Market Code"
            defaultValue={code}
            onChange={(e) => setCode(e.currentTarget.value)}
          />
          <Field.HelperText>
            This is used in the URL. Use only letters or numbers.
          </Field.HelperText>
          <Field.ErrorText>
            Illegal Characters. Use only letters or numbers.
          </Field.ErrorText>
        </Field.Root>
      )}
      <Field.Root required>
        <Field.Label>
          Mraket Name <Field.RequiredIndicator />
        </Field.Label>
        <Input
          placeholder="Market Name"
          defaultValue={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </Field.Root>
      <Field.Root>
        <Field.Label>Market Description</Field.Label>
        <Textarea
          value={description}
          placeholder="Market Description"
          onChange={(e) => setDesc(e.currentTarget.value)}
        />
      </Field.Root>
      <Field.Root>
        <Field.Label>Market Logo URL</Field.Label>
        <Input
          placeholder="Market Logo URL"
          defaultValue={logo}
          onChange={(e) => setLogo(e.currentTarget.value)}
        />
      </Field.Root>
      <Field.Root required mb={4}>
        <Field.Label>
          Stall Cost <Field.RequiredIndicator />
        </Field.Label>
        <NumberInput.Root
          unstyled
          spinOnPress={false}
          defaultValue={`${stallCost}`}
          formatOptions={{
            style: "currency",
            currency: "AUD",
            currencyDisplay: "symbol",
            currencySign: "accounting",
          }}
          onValueChange={(e) => {
            setStallCost(e.valueAsNumber);
          }}
        >
          <HStack gap="2">
            <NumberInput.DecrementTrigger asChild>
              <IconButton variant="outline" size="sm">
                <LuMinus />
              </IconButton>
            </NumberInput.DecrementTrigger>
            <NumberInput.ValueText
              textAlign="center"
              fontSize="lg"
              minW="3ch"
            />
            <NumberInput.IncrementTrigger asChild>
              <IconButton variant="outline" size="sm">
                <LuPlus />
              </IconButton>
            </NumberInput.IncrementTrigger>
          </HStack>
        </NumberInput.Root>
      </Field.Root>
      <Field.Root required mb={4}>
        <Field.Label>
          Power Cost <Field.RequiredIndicator />
        </Field.Label>
        <NumberInput.Root
          unstyled
          spinOnPress={false}
          defaultValue={`${powerCost}`}
          formatOptions={{
            style: "currency",
            currency: "AUD",
            currencyDisplay: "symbol",
            currencySign: "accounting",
          }}
          onValueChange={(e) => {
            setPowerCost(e.valueAsNumber);
          }}
        >
          <HStack gap="2">
            <NumberInput.DecrementTrigger asChild>
              <IconButton variant="outline" size="sm">
                <LuMinus />
              </IconButton>
            </NumberInput.DecrementTrigger>
            <NumberInput.ValueText
              textAlign="center"
              fontSize="lg"
              minW="3ch"
            />
            <NumberInput.IncrementTrigger asChild>
              <IconButton variant="outline" size="sm">
                <LuPlus />
              </IconButton>
            </NumberInput.IncrementTrigger>
          </HStack>
        </NumberInput.Root>
        <Field.HelperText>
          The cost for a powered stall. 0 to disable.
        </Field.HelperText>
      </Field.Root>
      <Field.Root required mb={4}>
        <Field.Label>
          Tent Cost <Field.RequiredIndicator />
        </Field.Label>
        <NumberInput.Root
          unstyled
          spinOnPress={false}
          defaultValue={`${tentCost}`}
          formatOptions={{
            style: "currency",
            currency: "AUD",
            currencyDisplay: "symbol",
            currencySign: "accounting",
          }}
          onValueChange={(e) => {
            setTentCost(e.valueAsNumber);
          }}
        >
          <HStack gap="2">
            <NumberInput.DecrementTrigger asChild>
              <IconButton variant="outline" size="sm">
                <LuMinus />
              </IconButton>
            </NumberInput.DecrementTrigger>
            <NumberInput.ValueText
              textAlign="center"
              fontSize="lg"
              minW="3ch"
            />
            <NumberInput.IncrementTrigger asChild>
              <IconButton variant="outline" size="sm">
                <LuPlus />
              </IconButton>
            </NumberInput.IncrementTrigger>
          </HStack>
        </NumberInput.Root>
        <Field.HelperText>
          The cost to rent a gazebo from the market. O to disable.
        </Field.HelperText>
      </Field.Root>
      {market?.stripeAccount?.trim() ? (
        <HStack
          paddingX={4}
          paddingY={2}
          border="1px solid grey"
          justifyContent="space-between"
          alignItems="center"
          fontWeight="700"
        >
          <Box>Online Payments are configured</Box>
          <Button
            colorPalette="red"
            variant="solid"
            onClick={() =>
              navigate(
                `/${market.code}/stripeConnect/${market.stripeAccount}/refresh`,
              )
            }
          >
            Refresh
          </Button>
        </HStack>
      ) : (
        <Box>
          Online Payments are disabled. <StripeConnectButton />
        </Box>
      )}
      <Field.Root invalid={admins.includes(newAdmin.trim())}>
        <Field.Label>Administrators</Field.Label>
        <Stack pl={2} width="100%">
          {admins.sort().map((p) => (
            <HStack key={p}>
              <GoDot />
              <Box flex={1}>{p}</Box>
              <CloseButton
                size="xs"
                onClick={() =>
                  setAdmins((prev) => prev.filter((pn) => pn != p))
                }
              />
            </HStack>
          ))}
        </Stack>
        <InputGroup
          endAddon={
            <IconButton
              variant="plain"
              onClick={() => {
                if (newAdmin.trim() && !admins.includes(newAdmin.trim())) {
                  setAdmins((p) => [...p, newAdmin.trim()]);
                  setNewAdmin("");
                }
              }}
            >
              <GoPlus />
            </IconButton>
          }
        >
          <Input
            value={newAdmin}
            onChange={(e) => setNewAdmin(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (newAdmin.trim() && !admins.includes(newAdmin.trim())) {
                  setAdmins((p) => [...p, newAdmin.trim()]);
                  setNewAdmin("");
                  e.preventDefault();
                  e.stopPropagation();
                }
              }
            }}
          />
        </InputGroup>
      </Field.Root>
      <BottomBar>
        <Button
          width="100%"
          colorPalette="green"
          loading={loading}
          disabled={!code.trim() || !name.trim()}
          onClick={() => {
            if (!code.trim() || !name.trim()) return;
            editMarket({
              code,
              name,
              description,
              logo,
              dates: market?.dates ?? [],
              admins,
              stallCost,
              powerCost,
              tentCost,
            });
          }}
        >
          {market ? "Save" : "Create"}
        </Button>
      </BottomBar>{" "}
    </Stack>
  );
};
