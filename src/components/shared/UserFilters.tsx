"use client";

import SelectFilter from "@/components/shared/SelectFilter";
import { useTranslations } from "next-intl";

const UsersFilter = () => {
  const t = useTranslations("common");
  const adminT = useTranslations("admin.users");
  return (
    <div className="grid grid-cols-1 gap-2 w-full sm:flex sm:flex-wrap sm:w-auto sm:items-center">
      <SelectFilter
        paramName="role"
        placeholder={t("role")}
        options={[
          { label: adminT("roles.superAdmin"), value: "SUPER_ADMIN" },
          { label: adminT("roles.admin"), value: "ADMIN" },
          { label: adminT("roles.owner"), value: "OWNER" },
          { label: adminT("roles.manager"), value: "MANAGER" },
          { label: adminT("roles.player"), value: "PLAYER" },
        ]}
      />

      <SelectFilter
        paramName="isActive"
        placeholder={t("status.label")}
        options={[
          { label: adminT("active"), value: "ACTIVE" },
          { label: adminT("inactive"), value: "INACTIVE" },
        ]}
      />

      <SelectFilter
        paramName="isVerified"
        placeholder={t("verification")}
        options={[
          { label: adminT("verified"), value: "true" },
          { label: adminT("unverified"), value: "false" },
        ]}
      />

      <SelectFilter
        paramName="isDeleted"
        placeholder={t("account")}
        options={[
          { label: adminT("deleted"), value: "true" },
          { label: adminT("retained"), value: "false" },
        ]}
      />
    </div>
  );
};

export default UsersFilter;
