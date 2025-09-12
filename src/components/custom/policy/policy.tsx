import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const Policy = () => {
  const t = useTranslations();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="View policy"
          variant="link"
          className="p-0 h-auto text-green-600 hover:text-green-700 underline"
        >
          {t("PolicyDialog.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t("PolicyDialog.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="prose prose-sm max-w-none">
          <h3>1. {t("PolicyDialog.general.title")}</h3>
          <p>{t("PolicyDialog.general.text")}</p>

          <h3>2. {t("PolicyDialog.operator.title")}</h3>
          <ul>
            <li>{t("PolicyDialog.operator.point1")}</li>
            <li>{t("PolicyDialog.operator.point2")}</li>
            <li>{t("PolicyDialog.operator.point3")}</li>
            <li>{t("PolicyDialog.operator.point4")}</li>
          </ul>

          <h3>3. {t("PolicyDialog.commission.title")}</h3>
          <p>{t("PolicyDialog.commission.text")}</p>

          <h3>4. {t("PolicyDialog.termination.title")}</h3>
          <p>{t("PolicyDialog.termination.text")}</p>

          <h3>5. {t("PolicyDialog.privacy.title")}</h3>
          <p>{t("PolicyDialog.privacy.text")}</p>

          <h3>6. {t("PolicyDialog.dispute.title")}</h3>
          <p>{t("PolicyDialog.dispute.text")}</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button aria-label="Understood" variant="outline">
              {t("PolicyDialog.understood")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Policy;
