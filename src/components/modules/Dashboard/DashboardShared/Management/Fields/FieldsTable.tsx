/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useTransition, useState } from "react";
import { getFieldsColumns } from "./FieldsColumns";
import UpdateFieldFormDialog from "./UpdateFieldFormDialog";
import SpecialPricingModal from "./SpecialPricing/SpecialPricingModal";
import { useTranslations } from "next-intl";

interface PatientsTableProps {
  fields: any[];
}

const FieldsTable = ({ fields }: PatientsTableProps) => {
  const t = useTranslations("owner.fieldSettings");
  const [isPending, startTransition] = useTransition();

  const [selectedFieldEdit, setSelectedFieldEdit] = useState<any | null>(null);
  const [specialPricingFieldId, setSpecialPricingFieldId] = useState<
    string | null
  >(null);

  return (
    <>
      <ManagementTable
        data={fields || []}
        columns={getFieldsColumns(t)}
        getRowKey={(field) => field.id}
        onEdit={(field) => setSelectedFieldEdit(field)}
        onSpecialPricing={(field) => setSpecialPricingFieldId(field.id)}
        isRefreshing={isPending}
        isFields={true}
      />

      <UpdateFieldFormDialog
        open={selectedFieldEdit !== null}
        onClose={() => setSelectedFieldEdit(null)}
        onSuccess={() => setSelectedFieldEdit(null)}
        field={selectedFieldEdit}
      />

      <SpecialPricingModal
        open={!!specialPricingFieldId}
        fieldId={specialPricingFieldId}
        // fieldName={field.fieldName}
        onClose={() => setSpecialPricingFieldId(null)}
      />
    </>
  );
};

export default FieldsTable;
