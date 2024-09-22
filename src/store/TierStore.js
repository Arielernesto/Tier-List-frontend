import { create } from "zustand";

export const useTierStore = create((set,get) => {

    return {
        SetTier: (tierMaker) => {
            set({tier: tierMaker})
        },
        tier: "",
        imageQuantity: [],
        setImageQuant: (quant) => {
            set({imageQuantity: quant})
        },
        setRowsRankLowtest: (row) => {
            const { rowRank } = get()
            const New = {
                hightest: rowRank.hightest,
                lowtest: row
            }
            set({rowRank: New})
        },
        setRowsRankHightest: (row) => {
            const { rowRank } = get()
            const New = {
                hightest: row,
                lowtest: rowRank.lowtest
            }
            set({rowRank: New})
        },
        rowRank: {
            hightest: "S",
            lowtest: "E"
        },
        setChanges: () => {
            const { changes } = get()
            set({changes: changes + 1})
        },
        changes: 0,
        setAverage: (average) => {
            set({ average })
        },
        average: "B",
        nameTier: "",
        descriptionTier: "",
        setTierInfo: ( nameTier, descriptionTier) => {
            set({ nameTier, descriptionTier })     
        }
    }
})