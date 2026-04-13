"use client"

import { useState, useEffect } from "react"
import { X, Ship, IndianRupee, Image as ImageIcon, Map, Sparkles, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type AddFleetModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function AddFleetModal({ isOpen, onClose, onSuccess, initialData }: AddFleetModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [id, setId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [isExclusive, setIsExclusive] = useState(false);
    const [pricingType, setPricingType] = useState("hourly");
    const [image, setImage] = useState("");
    const [capacity, setCapacity] = useState("10");
    const [duration, setDuration] = useState("2");
    const [price, setPrice] = useState("");
    const [pricePerHour, setPricePerHour] = useState("");
    
    // Details
    const [series, setSeries] = useState("");
    const [route, setRoute] = useState("");
    const [timing, setTiming] = useState(""); // mostly for tickets
    const [foodOptions, setFoodOptions] = useState("");
    const [highlight, setHighlight] = useState("");
    
    // Arrays (parsed as comma separated for simple editing)
    const [features, setFeatures] = useState("");
    const [inclusions, setInclusions] = useState("");
    const [bestSuitedFor, setBestSuitedFor] = useState("");
    const [images, setImages] = useState(""); // extra gallery images
    
    // Tag Object
    const [tagLabel, setTagLabel] = useState("");
    const [tagType, setTagType] = useState("featured");

    // Reset or populate form when modal opens
    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (initialData) {
                setId(initialData.id);
                setTitle(initialData.title || "");
                setIsExclusive(initialData.isExclusive || false);
                setPricingType(initialData.pricingType || "hourly");
                setImage(initialData.image || "");
                setCapacity(initialData.capacity?.toString() || "");
                setDuration(initialData.duration?.toString() || "");
                setPrice(initialData.price || "");
                setPricePerHour(initialData.pricePerHour?.toString() || "");
                setSeries(initialData.series || "");
                setRoute(initialData.route || "");
                setTiming(initialData.timing || "");
                setFoodOptions(initialData.foodOptions || "");
                setHighlight(initialData.highlight || "");
                
                // Arrays to strings
                setFeatures(Array.isArray(initialData.features) ? initialData.features.join(", ") : "");
                setInclusions(Array.isArray(initialData.inclusions) ? initialData.inclusions.join(", ") : "");
                setBestSuitedFor(Array.isArray(initialData.bestSuitedFor) ? initialData.bestSuitedFor.join(", ") : "");
                setImages(Array.isArray(initialData.images) ? initialData.images.join(", ") : "");

                if (initialData.tag) {
                    setTagLabel(initialData.tag.label || "");
                    setTagType(initialData.tag.type || "featured");
                } else {
                    setTagLabel("");
                    setTagType("featured");
                }
            } else {
                // Reset for Add
                setId(null);
                setTitle("");
                setIsExclusive(false);
                setPricingType("hourly");
                setImage("");
                setCapacity("10");
                setDuration("2");
                setPrice("");
                setPricePerHour("");
                setSeries("");
                setRoute("");
                setTiming("");
                setFoodOptions("");
                setHighlight("");
                setFeatures("");
                setInclusions("");
                setBestSuitedFor("");
                setImages("");
                setTagLabel("");
                setTagType("featured");
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Helper to convert comma string to array
        const toArray = (str: string) => str ? str.split(",").map(s => s.trim()).filter(Boolean) : null;

        const payload = {
            id, // if null, it's an add, else it's an edit
            title,
            isExclusive,
            pricingType,
            image,
            capacity,
            duration,
            timing,
            price,
            pricePerHour: parseInt(pricePerHour) || 0,
            series,
            route,
            foodOptions,
            highlight,
            features: toArray(features),
            inclusions: toArray(inclusions),
            bestSuitedFor: toArray(bestSuitedFor),
            images: toArray(images),
            tag: tagLabel ? { type: tagType, label: tagLabel } : null,
            // packages can be added as raw JSON string box later if needed, left out for basic UI simplicity
        };

        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch("/api/fleets", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                onSuccess();
                onClose();
            } else {
                setError(data.error || "Failed to save fleet.");
            }
        } catch (err: any) {
            setError("Internal Server Error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputClasses = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all font-medium text-slate-900";
    const labelClasses = "text-xs font-bold uppercase tracking-widest text-[#10233D] mb-1.5 ml-1 block";

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#10233D]/40 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl flex flex-col my-auto animate-in zoom-in-95 duration-300 ring-1 ring-black/5">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-xl rounded-t-[2rem] sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#10233D] rounded-2xl flex items-center justify-center shadow-lg shadow-[#10233D]/20">
                            <Ship className="w-5 h-5 text-[#D4AF37]" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#10233D] tracking-tight">{id ? "Edit Fleet Configuration" : "Add New Fleet"}</h2>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-widest">{id ? `ID: ${id}` : 'Database Registration'}</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all">
                        <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto max-h-[75vh]">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium mb-8 border border-red-100 shadow-sm flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse"></div>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Core Info */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Ship className="w-5 h-5 text-slate-400" />
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Base Identity</h3>
                                <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-1 lg:col-span-2">
                                    <Label className={labelClasses}>Yacht Title *</Label>
                                    <input required className={`${inputClasses} bg-white ring-1 ring-slate-100 shadow-sm text-lg !font-black`} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. The Grand Blue Diamond" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Series / Model</Label>
                                    <input className={inputClasses} value={series} onChange={e => setSeries(e.target.value)} placeholder="e.g. Majesty 66" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Pricing Type</Label>
                                    <select className={inputClasses} value={pricingType} onChange={e => setPricingType(e.target.value)}>
                                        <option value="hourly">Hourly Charter</option>
                                        <option value="ticket">Ticket Based Cruise</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Capacity (Guests) *</Label>
                                    <input required className={inputClasses} value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="e.g. 15" />
                                </div>
                                <div className="space-y-1 flex items-center justify-between bg-slate-50 px-4 rounded-xl border border-slate-200">
                                    <Label className={`${labelClasses} mb-0`}>Exclusive Fleet?</Label>
                                    <input type="checkbox" className="w-5 h-5 cursor-pointer accent-[#10233D]" checked={isExclusive} onChange={e => setIsExclusive(e.target.checked)} />
                                </div>
                            </div>
                        </section>

                        {/* Financials & Timing */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <IndianRupee className="w-5 h-5 text-slate-400" />
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Rates & Logistics</h3>
                                <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-1 lg:col-span-2">
                                    <Label className={labelClasses}>Display Price String *</Label>
                                    <input required className={inputClasses} value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. ₹15,000" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Numeric Price/Hr</Label>
                                    <input type="number" className={inputClasses} value={pricePerHour} onChange={e => setPricePerHour(e.target.value)} placeholder="e.g. 7500" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Display Duration *</Label>
                                    <input required className={inputClasses} value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 2 hrs" />
                                </div>
                                <div className="space-y-1 lg:col-span-2">
                                    <Label className={labelClasses}>Route / Location</Label>
                                    <input className={inputClasses} value={route} onChange={e => setRoute(e.target.value)} placeholder="e.g. Mandovi River & Arabian Sea" />
                                </div>
                                <div className="space-y-1 lg:col-span-2">
                                    <Label className={labelClasses}>Fixed Timing (For Tickets)</Label>
                                    <input className={inputClasses} value={timing} onChange={e => setTiming(e.target.value)} placeholder="e.g. 7:00 PM - 10:00 PM" disabled={pricingType !== 'ticket'} />
                                </div>
                            </div>
                        </section>

                        {/* Descriptive Lists */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Map className="w-5 h-5 text-slate-400" />
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Amenities & Details <span className="text-xs text-slate-300 font-medium normal-case">(Comma separated)</span></h3>
                                <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Features</Label>
                                    <textarea className={`${inputClasses} h-20 py-3 resize-none`} value={features} onChange={e => setFeatures(e.target.value)} placeholder="Air Conditioning, Upper Deck, Bluetooth Audio" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Inclusions</Label>
                                    <textarea className={`${inputClasses} h-20 py-3 resize-none`} value={inclusions} onChange={e => setInclusions(e.target.value)} placeholder="Soft Drinks, Ice, Life Jackets" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Food & Drinks Setup</Label>
                                    <textarea className={`${inputClasses} h-20 py-3 resize-none`} value={foodOptions} onChange={e => setFoodOptions(e.target.value)} placeholder="BYOB allowed, Live BBQ setup available" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Best Suited For</Label>
                                    <textarea className={`${inputClasses} h-20 py-3 resize-none`} value={bestSuitedFor} onChange={e => setBestSuitedFor(e.target.value)} placeholder="Birthdays, Corporate Gatherings, Sunset Cruise" />
                                </div>
                            </div>
                        </section>

                        {/* Media & Tags */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Media & Highlights</h3>
                                <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Main Image URL *</Label>
                                    <input required type="text" className={inputClasses} value={image} onChange={e => setImage(e.target.value)} placeholder="e.g. /images/yacht/new.jpg" />
                                </div>
                                <div className="space-y-1">
                                    <Label className={labelClasses}>Gallery Image URLs (Comma separated)</Label>
                                    <textarea className={`${inputClasses} h-24 py-3 resize-none`} value={images} onChange={e => setImages(e.target.value)} placeholder="/images/g1.jpg, /images/g2.jpg" />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <Label className={labelClasses}>Marketing Highlight</Label>
                                        <input type="text" className={inputClasses} value={highlight} onChange={e => setHighlight(e.target.value)} placeholder="e.g. Most popular yacht of 2024" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className={labelClasses}>Tag Label (Optional)</Label>
                                        <input type="text" className={inputClasses} value={tagLabel} onChange={e => setTagLabel(e.target.value)} placeholder="e.g. Best Value" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className={labelClasses}>Badge Color Theme</Label>
                                        <select className={inputClasses} value={tagType} onChange={e => setTagType(e.target.value)}>
                                            <option value="featured">Featured (Gold)</option>
                                            <option value="new">New (Emerald)</option>
                                            <option value="best">Best (Blue)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end items-center gap-4 pt-8 bg-white border-t border-slate-100">
                            <Button type="button" variant="outline" className="h-[3.25rem] px-8 rounded-xl font-bold text-slate-500 border-slate-200 hover:bg-slate-50" onClick={onClose}>Cancel</Button>
                            <Button type="submit" className="h-[3.25rem] px-10 rounded-xl bg-[#10233D] hover:bg-[#183152] text-white font-black shadow-xl shadow-[#10233D]/10" disabled={loading}>
                                {loading ? "Saving Progress..." : (id ? "Save Changes" : "Create Fleet")}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
