import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

export default function Iot() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-ocean-900">
                        IoT
                    </h1>
                    <p className="text-sm text-ocean-500">
                        Thiết bị – mock API.
                    </p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-ocean-500 text-white">
                    <Plus className="w-4 h-4 inline-block mr-2" />
                    Thêm mới
                </button>
            </div>

            <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300" />
                <input
                    placeholder="Tìm theo ID, vị trí, mô tả…"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-ocean-100 bg-white"
                />
            </div>

            <div className="overflow-auto rounded-xl border border-ocean-100 bg-white">
                <table className="min-w-[860px] w-full">
                    <thead className="bg-ocean-100/40">
                        <tr className="text-sm">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">ID IoT</th>
                            <th className="px-4 py-3">Vị trí</th>
                            <th className="px-4 py-3">Kinh độ</th>
                            <th className="px-4 py-3">Vĩ độ</th>
                            <th className="px-4 py-3">Mô tả</th>
                            <th className="px-4 py-3 text-center">
                                Trạng thái
                            </th>
                            <th className="px-4 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ocean-100">
                        {/* {filtered.map((r, i) => (
                            <tr
                                key={r.id}
                                className="text-sm hover:bg-ocean-50/60"
                            >
                                <td className="px-4 py-3">{i + 1}</td>
                                <td className="px-4 py-3 font-medium">
                                    {r.id_iot}
                                </td>
                                <td className="px-4 py-3">{r.vi_tri}</td>
                                <td className="px-4 py-3">{r.kinh_do}</td>
                                <td className="px-4 py-3">{r.vi_do}</td>
                                <td className="px-4 py-3">{r.mo_ta}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => toggleStatus(r.id)}
                                        className={`px-2 py-1 rounded text-white ${
                                            r.tinh_trang
                                                ? "bg-green-600"
                                                : "bg-red-500"
                                        }`}
                                    >
                                        {r.tinh_trang ? "Hoạt động" : "Dừng"}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setForm(r);
                                                setEditingId(r.id);
                                                setShowForm(true);
                                            }}
                                            className="px-3 py-1.5 rounded-lg border border-ocean-100 hover:bg-ocean-100/50"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteItem(r.id)}
                                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-8 text-center text-ocean-500"
                                >
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )} */}
                    </tbody>
                </table>
            </div>

            {/* {showForm && (
                <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">
                                {editingId ? "Cập nhật" : "Thêm IoT"}
                            </h3>
                            <button className="p-2 hover:bg-ocean-50 rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                placeholder="ID IoT"
                                value={form.id_iot}
                                onChange={(e) =>
                                    setForm({ ...form, id_iot: e.target.value })
                                }
                                className="px-3 py-2 rounded-lg border border-ocean-100"
                            />
                            <input
                                placeholder="Vị trí"
                                value={form.vi_tri}
                                onChange={(e) =>
                                    setForm({ ...form, vi_tri: e.target.value })
                                }
                                className="px-3 py-2 rounded-lg border border-ocean-100"
                            />
                            <input
                                placeholder="Kinh độ"
                                value={form.kinh_do}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        kinh_do: e.target.value,
                                    })
                                }
                                className="px-3 py-2 rounded-lg border border-ocean-100"
                            />
                            <input
                                placeholder="Vĩ độ"
                                value={form.vi_do}
                                onChange={(e) =>
                                    setForm({ ...form, vi_do: e.target.value })
                                }
                                className="px-3 py-2 rounded-lg border border-ocean-100"
                            />
                            <textarea
                                placeholder="Mô tả"
                                value={form.mo_ta}
                                onChange={(e) =>
                                    setForm({ ...form, mo_ta: e.target.value })
                                }
                                className="px-3 py-2 rounded-lg border border-ocean-100 md:col-span-2"
                            />
                            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-ocean-500 text-white"
                                >
                                    {editingId ? "Cập nhật" : "Thêm"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 rounded-lg border border-ocean-100"
                                >
                                    Huỷ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}
        </div>
    );
}
