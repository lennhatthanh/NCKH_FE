import axios from "axios";
import { useState } from "react";

export default function GuiMail() {
    return (
        <div className="space-y-4 max-w-3xl">
            <h1 className="text-2xl font-semibold text-ocean-900">Gửi mail</h1>
            <div className="rounded-xl bg-white border border-ocean-100 p-4 space-y-3">
                <input
                    placeholder="Người nhận (email)"
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100"
                />
                <input
                    placeholder="Tiêu đề"
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100"
                />
                <textarea
                    placeholder="Nội dung"
                    rows={8}
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100"
                />
                <button
                    className="px-4 py-2 rounded-lg bg-ocean-500 text-white disabled:opacity-60"
                >
                    {true ? "Đang gửi…" : "Gửi mail"}
                </button>
            </div>
        </div>
    );
}
