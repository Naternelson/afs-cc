import { ipcMain } from "electron";
import { IPCChannels } from "../channels";
import axios from "axios";
import { NtlmClient } from "axios-ntlm";
const axiosNTLM = NtlmClient({
  username: "NRNelson",
  password: "Banked-Capsize4-Geometry",
  domain: "AFS", // e.g., "MYCOMPANY"
  workstation: "SymboticCC", // e.g., "MYWORKSTATION"
});

const siteUrl =
  "https://slcbizprod.afstores.com/ibi_apps/WFServlet.ibfs?IBFS1_action=RUNFEX&IBFS_path=/WFC/Repository/Warehouse/symbotic_reporting/Symbotic_Replenishment_Dash/repo/datatables/needs-replenishment-table.fex";

const dataMap = {
  qlikWeekQty: "weeklyQty",
  ITEMNO: "sku",
  DESC: "description",
  EXPIRATIONDATE: "expirationDate",
  PALLETNO: "palletId",
  QTY: "qty",
  SLOT: "slot",
  PICKAISLE: "pickAisle",
  systemTargetAmt: "systemTargetAmount",
  systemTargetTargetAmtDesc: "systemTargetAmountDescription",
  qtyNeededFromPallet: "qtyNeededFromPallet",
};
ipcMain.handle(IPCChannels.DATA_PALLETS, async (event) => {
  const d = await axiosNTLM.get(siteUrl);

  // Split the raw text into the parts
  const parts = d.data.split(/}\s*{/).map((part: any, i: number, arr: any) => {
    if (i === 0) return part + "}";
    if (i === arr.length - 1) return "{" + part;
    return "{" + part + "}";
  });

  const recordsJson = parts[1];

  const recordsObj = JSON.parse(recordsJson);

  const palletArray = recordsObj.records.map((pallet: any) => {
    const mappedData: Record<string, any> = {};
    (Object.keys(dataMap) as Array<keyof typeof dataMap>).forEach((key) => {
      if (pallet[key] !== undefined) {
        mappedData[dataMap[key]] = pallet[key];
      }
    });
    return mappedData;
  });

  return palletArray as Array<{
    weeklyQty: number;
    sku: string;
    description: string;
    expirationDate: string;
    palletId: string;
    qty: number;
    slot: string;
    pickAisle: string;
    systemTargetAmount: number;
    systemTargetAmountDescription: string;
    qtyNeededFromPallet: number;
  }>;
});
