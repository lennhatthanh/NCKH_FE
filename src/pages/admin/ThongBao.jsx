import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { dataNhanVien } from "../../features/nhanvien/nhanVienSlice";
import { capNhatThongBao, dataThongBao, themThongBao, xoaThongBao } from "../../features/thongbao/thongBaoSlice";
const defaultThongBao = {
    id_nhan_vien: "",
    tieu_de: "",
    noi_dung: "",
    tinh_trang: 1,
};
export default function ThongBao() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.thongbao.thongbao);
    const dataNV = useSelector((state) => state.nhanvien.nhanvien);
    useEffect(() => {
        dispatch(dataNhanVien());
        dispatch(dataThongBao());
    }, []);

    const [thongBao, setThongBao] = useState(defaultThongBao);
    const handleDelThongBao = async (id) => {
        const result = await dispatch(xoaThongBao(id));
        if (xoaThongBao.fulfilled.match(result)) {
            toast.success(result.payload.message || "Xóa thành công");
        } else {
            toast.error(result.payload.message || "Xóa thất bại");
        }
    };

    const handleUpdateThongBao = async (payload) => {
        try {
            const result = await dispatch(capNhatThongBao(payload)).unwrap();
            toast.success(result.message || "Cập nhật thành công");
        } catch (error) {
            toast.error(error || "Cập nhật thất bại");
        }
    };

    const handleAddThongBao = async () => {
        const result = await dispatch(themThongBao(thongBao));
        if (themThongBao.fulfilled.match(result)) {
            toast.success(result.payload.message || "Thêm mới thành công");
        } else {
            toast.error(result.payload || "Thêm mới thất bại");
        }
        setThongBao({});
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-ocean-900">Thông báo</h1>
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
                                <DialogTitle>Thêm thông báo</DialogTitle>
                                <DialogDescription>Nhấn xác nhận để lưu thay đổi</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Nhân Viên</Label>
                                    <Select
                                        onValueChange={(e) =>
                                            setThongBao({
                                                ...thongBao,
                                                id_nhan_vien: e,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Nhân viên thông báo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dataNV.map((value, index) => (
                                                <SelectItem key={index} value={value.id}>
                                                    {value.ho_va_ten}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Tiêu đề</Label>
                                    <Input
                                        onChange={(e) =>
                                            setThongBao({
                                                ...thongBao,
                                                tieu_de: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Nội dung</Label>
                                    <Input
                                        onChange={(e) =>
                                            setThongBao({
                                                ...thongBao,
                                                noi_dung: e.target.value,
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
                                        onClick={handleAddThongBao}
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
                    placeholder="Tìm theo họ và tên/số điện thoại ...."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-ocean-100 bg-white"
                />
            </div>

            <div className="overflow-auto max-h-[430px] rounded-xl border border-ocean-100 bg-white">
                <table className="min-w-[920px] w-full">
                    <thead className="bg-ocean-100/40">
                        <tr className="text-sm">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Nhân viên</th>
                            <th className="px-4 py-3">Tiêu đề</th>
                            <th className="px-4 py-3">Nội dung</th>
                            <th className="px-4 py-3 text-center">Trạng thái</th>
                            <th className="px-4 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ocean-100 text-center">
                        {data.map((r, i) => (
                            <tr key={r.id} className="text-sm hover:bg-ocean-50/60">
                                <td className="px-4 py-3">{i + 1}</td>
                                <td className="px-4 py-3 font-medium">
                                    {dataNV.find((value) => value.id === r.id_nhan_vien).ho_va_ten}
                                </td>
                                <td className="px-4 py-3">{r.tieu_de}</td>
                                <td className="px-4 py-3">{r.noi_dung}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() =>
                                            handleUpdateThongBao({
                                                ...r,
                                                tinh_trang: !r.tinh_trang,
                                            })
                                        }
                                        className={`px-4 py-2 rounded-lg text-white text-nowrap font-medium cursor-pointer hover:scale-110 ${
                                            r.tinh_trang ? "bg-green-600" : "bg-red-500"
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
                                                            setThongBao(r);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg border border-ocean-100 hover:bg-ocean-100/50"
                                                    >
                                                        <Pencil className="w-4 h-4" />
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
                                                            <Label htmlFor="name-1">Trạm Quản Lý</Label>
                                                            <Select
                                                                value={thongBao.id_nhan_vien}
                                                                onValueChange={(e) =>
                                                                    setThongBao({
                                                                        ...thongBao,
                                                                        id_nhan_vien: e,
                                                                    })
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Nhân viên thông báo" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataNV.map((value, index) => (
                                                                        <SelectItem key={index} value={value.id}>
                                                                            {value.ho_va_ten}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">Tiêu đề</Label>
                                                            <Input
                                                                value={thongBao.tieu_de}
                                                                onChange={(e) =>
                                                                    setThongBao({
                                                                        ...thongBao,
                                                                        tieu_de: e.target.value,
                                                                    })
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">Nội dung</Label>
                                                            <Input
                                                                value={thongBao.noi_dung}
                                                                onChange={(e) =>
                                                                    setThongBao({
                                                                        ...thongBao,
                                                                        noi_dung: e.target.value,
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
                                                                onClick={() => handleUpdateThongBao(thongBao)}
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
                                                <button className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Xóa trạm sơ tán</DialogTitle>
                                                    <DialogDescription>
                                                        Nhấn xác nhận để xóa và bạn không thể thu hồi!
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button
                                                            onClick={() => handleDelThongBao(r.id)}
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
                                <td colSpan={9} className="px-4 py-8 text-center text-ocean-500">
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
