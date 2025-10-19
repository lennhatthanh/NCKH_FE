import axios from "axios";
import { use, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    capNhatTramSoTan,
    dataTramSoTan,
    themTramSoTan,
    xoaTramSoTan,
} from "../../features/tramsotan/tramSoTanSlice";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
const defaultTramSoTan = {
    ten_khu_vuc: "",
    so_dien_thoai: "",
    vi_do: "",
    kinh_do: "",
    mo_ta: "",
    suc_chua: 0,
    dang_chua: 0,
    tinh_trang: 1,
};
export default function TramSoTan() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.tramsotan.tramsotan) || [];
    useEffect(() => {
        dispatch(dataTramSoTan());
    }, []);

    const [tramSoTan, setTramSoTan] = useState(defaultTramSoTan);
    const handleDelTramSoTan = async (id) => {
        const result = await dispatch(xoaTramSoTan(id));
        if (xoaTramSoTan.fulfilled.match(result)) {
            toast.success(result.payload.message || "Xóa thành công");
        } else {
            toast.error(result.payload.message || "Xóa thất bại");
        }
    };

    const handleUpdateTramSoTan = async (payload) => {
        try {
            const result = await dispatch(capNhatTramSoTan(payload)).unwrap();
            toast.success(result.message || "Cập nhật thành công");
        } catch (error) {
            toast.error(error || "Cập nhật thất bại");
        }
    };

    const handleAddTramSoTan = async () => {
        const result = await dispatch(themTramSoTan(tramSoTan));
        if (themTramSoTan.fulfilled.match(result)) {
            toast.success(result.payload.message || "Thêm mới thành công");
        } else {
            toast.error(result.payload || "Thêm mới thất bại");
        }
        setTramSoTan({});
    };
    const handleEditClick = (value) => {
        setTramSoTan({
            ma_giam_gia: value.ma_giam_gia,
            loai_giam_gia: value.loai_giam_gia,
            mo_ta: value.mo_ta,
            gia_tri_giam: value.gia_tri_giam,
            tinh_trang: value.tinh_trang,
            ngay_bat_dau: value.ngay_bat_dau,
            ngay_ket_thuc: value.ngay_ket_thuc,
            id: value.id,
        });
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-ocean-900">
                        Trạm sơ tán
                    </h1>
                </div>
                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ocean-500 text-white cursor-pointer">
                                <Plus className="w-4 h-4" /> Thêm mới
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] h-[500px] overflow-auto">
                            <DialogHeader>
                                <DialogTitle>Thêm trạm sơ tán</DialogTitle>
                                <DialogDescription>
                                    Nhấn xác nhận để lưu thay đổi
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Tên khu vực</Label>
                                    <Input
                                        onChange={(e) =>
                                            setTramSoTan({
                                                ...tramSoTan,
                                                ten_khu_vuc: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">
                                        Số điện thoại
                                    </Label>
                                    <Input
                                        onChange={(e) =>
                                            setTramSoTan({
                                                ...tramSoTan,
                                                so_dien_thoai: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Kinh độ</Label>
                                    <Input
                                        onChange={(e) =>
                                            setTramSoTan({
                                                ...tramSoTan,
                                                kinh_do: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Vĩ độ</Label>
                                    <Input
                                        onChange={(e) =>
                                            setTramSoTan({
                                                ...tramSoTan,
                                                vi_do: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Mô tả</Label>
                                    <Input
                                        onChange={(e) =>
                                            setTramSoTan({
                                                ...tramSoTan,
                                                mo_ta: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Sức chứa</Label>
                                    <Input
                                        onChange={(e) =>
                                            setTramSoTan({
                                                ...tramSoTan,
                                                suc_chua: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Đang chứa</Label>
                                    <Input
                                        onChange={(e) =>
                                            setTramSoTan({
                                                ...tramSoTan,
                                                dang_chua: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button
                                        onClick={handleAddTramSoTan}
                                        className="bg-ocean-500 hover:bg-ocean-900 cursor-pointer"
                                        type="submit"
                                    >
                                        Save changes
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>

            <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300" />
                <input
                    placeholder="Tìm theo tên khu vực/địa chỉ…"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-ocean-100 bg-white"
                />
            </div>

            <div className="overflow-auto max-h-[430px] rounded-xl border border-ocean-100 bg-white">
                <table className="min-w-[920px] w-full">
                    <thead className="bg-ocean-100/40">
                        <tr className="text-sm">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Tên khu vực</th>
                            <th className="px-4 py-3">Số điện thoại</th>
                            <th className="px-4 py-3">Kinh độ</th>
                            <th className="px-4 py-3">Vĩ độ</th>
                            <th className="px-4 py-3">Mô tả</th>
                            <th className="px-4 py-3">Sức chức</th>
                            <th className="px-4 py-3">Đang chứa</th>
                            <th className="px-4 py-3 text-center">
                                Trạng thái
                            </th>
                            <th className="px-4 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ocean-100 text-center">
                        {data.map((r, i) => (
                            <tr
                                key={r.id}
                                className="text-sm hover:bg-ocean-50/60"
                            >
                                <td className="px-4 py-3">{i + 1}</td>
                                <td className="px-4 py-3 font-medium">
                                    {r.ten_khu_vuc}
                                </td>
                                <td className="px-4 py-3">{r.so_dien_thoai}</td>
                                <td className="px-4 py-3">{r.kinh_do}</td>
                                <td className="px-4 py-3">{r.vi_do}</td>
                                <td className="px-4 py-3">{r.mo_ta}</td>
                                <td className="px-4 py-3">{r.suc_chua}</td>
                                <td className="px-4 py-3">{r.dang_chua}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() =>
                                            handleUpdateTramSoTan({
                                                ...r,
                                                tinh_trang: !r.tinh_trang,
                                            })
                                        }
                                        className={`px-4 py-2 rounded-lg text-white text-nowrap font-medium cursor-pointer hover:scale-110 ${
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
                                        <Dialog>
                                            <form>
                                                <DialogTrigger asChild>
                                                    <button
                                                        onClick={() => {
                                                            setTramSoTan(r);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg border border-ocean-100 hover:bg-ocean-100/50"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px] h-[500px] overflow-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Thêm trạm sơ tán
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Nhấn xác nhận để lưu
                                                            thay đổi
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4">
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">
                                                                Tên khu vực
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    tramSoTan.ten_khu_vuc
                                                                }
                                                                onChange={(e) =>
                                                                    setTramSoTan(
                                                                        {
                                                                            ...tramSoTan,
                                                                            ten_khu_vuc:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">
                                                                Số điện thoại
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    tramSoTan.so_dien_thoai
                                                                }
                                                                onChange={(e) =>
                                                                    setTramSoTan(
                                                                        {
                                                                            ...tramSoTan,
                                                                            so_dien_thoai:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">
                                                                Kinh độ
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    tramSoTan.kinh_do
                                                                }
                                                                onChange={(e) =>
                                                                    setTramSoTan(
                                                                        {
                                                                            ...tramSoTan,
                                                                            kinh_do:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">
                                                                Vĩ độ
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    tramSoTan.vi_do
                                                                }
                                                                onChange={(e) =>
                                                                    setTramSoTan(
                                                                        {
                                                                            ...tramSoTan,
                                                                            vi_do: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">
                                                                Mô tả
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    tramSoTan.mo_ta
                                                                }
                                                                onChange={(e) =>
                                                                    setTramSoTan(
                                                                        {
                                                                            ...tramSoTan,
                                                                            mo_ta: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">
                                                                Sức chứa
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    tramSoTan.suc_chua
                                                                }
                                                                onChange={(e) =>
                                                                    setTramSoTan(
                                                                        {
                                                                            ...tramSoTan,
                                                                            suc_chua:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">
                                                                Đang chứa
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    tramSoTan.dang_chua
                                                                }
                                                                onChange={(e) =>
                                                                    setTramSoTan(
                                                                        {
                                                                            ...tramSoTan,
                                                                            dang_chua:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button
                                                                onClick={() =>
                                                                    handleUpdateTramSoTan(
                                                                        tramSoTan
                                                                    )
                                                                }
                                                                className="bg-ocean-500 hover:bg-ocean-900 cursor-pointer"
                                                                type="submit"
                                                            >
                                                                Save changes
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </form>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button
                                                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Xóa trạm sơ tán
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Nhấn xác nhận để xóa và
                                                        bạn không thể thu hồi!
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button
                                                            onClick={() =>
                                                                handleDelTramSoTan(
                                                                    r.id
                                                                )
                                                            }
                                                            className="bg-ocean-500 hover:bg-ocean-900 cursor-pointer"
                                                            type="submit"
                                                        >
                                                            Save changes
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data?.length === 0 && (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-4 py-8 text-center text-ocean-500"
                                >
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Toaster />
        </div>
    );
}
