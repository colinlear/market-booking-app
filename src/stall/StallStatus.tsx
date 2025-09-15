import type { StallStatusValues } from "@/types";
import { Tag } from "@chakra-ui/react";
import type { FC } from "react";
import { HiCheck } from "react-icons/hi";

export const StallStatusWidget: FC<{ status?: StallStatusValues }> = ({
  status,
}) => {
  return status == "approved" ? (
    <Tag.Root colorPalette="green" variant="solid">
      <Tag.Label>Approved</Tag.Label>
      <Tag.EndElement>
        <HiCheck />
      </Tag.EndElement>
    </Tag.Root>
  ) : status == "rejected" ? (
    <Tag.Root colorPalette="red" variant="solid">
      <Tag.Label>Rejected</Tag.Label>
      <Tag.EndElement>
        <Tag.CloseTrigger />
      </Tag.EndElement>
    </Tag.Root>
  ) : status == "pending" ? (
    <Tag.Root colorPalette="yellow" variant="solid">
      <Tag.Label>Pending Approval</Tag.Label>
    </Tag.Root>
  ) : !status ? (
    <>
      <Tag.Root colorPalette="grey" variant="solid">
        <Tag.Label>Not registered</Tag.Label>
      </Tag.Root>
    </>
  ) : null;
};
