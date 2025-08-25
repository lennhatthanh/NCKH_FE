import axios from "axios";
import { useState } from "react";

export default function GuiMail() {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);

    const sendMail = async () => {
        setSending(true);
        try {
            await axios.post("/admin/gui-mail", { to, subject, content });
            alert("Đã gửi mail (mock)!");
            setTo("");
            setSubject("");
            setContent("");
        } catch (e) {
            console.error(e);
            alert("Gửi mail thất bại!");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-4 max-w-3xl">
            <h1 className="text-2xl font-semibold text-ocean-900">Gửi mail</h1>
            <div className="rounded-xl bg-white border border-ocean-100 p-4 space-y-3">
                <input
                    placeholder="Người nhận (email)"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100"
                />
                <input
                    placeholder="Tiêu đề"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100"
                />
                <textarea
                    placeholder="Nội dung"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100"
                />
                <button
                    onClick={sendMail}
                    disabled={sending}
                    className="px-4 py-2 rounded-lg bg-ocean-500 text-white disabled:opacity-60"
                >
                    {sending ? "Đang gửi…" : "Gửi mail"}
                </button>
            </div>
        </div>
    );
}
