import type { FC } from "react";

export const PhoneNumber: FC<{ phone?: string }> = ({ phone }) => {
  if (!phone?.trim()) return "";
  const international = phone
    .trim()
    .match(/^(\+\d\d)(\d)(\d\d\d\d)(\d\d\d\d)$/);
  if (international) {
    return `${international[1]} ${international[2]} ${international[3]} ${international[4]}`;
  }
  const mobile = phone.match(/^(04)(\d\d\d\d)(\d\d\d\d)$/);
  if (mobile) {
    return `${mobile[1]} ${mobile[2]} ${mobile[3]}`;
  }
  return phone;
};
