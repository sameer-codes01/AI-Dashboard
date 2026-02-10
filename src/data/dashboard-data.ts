import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, ShoppingCart, LucideIcon } from "lucide-react";

export const kpiData: {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: LucideIcon;
    color: string;
    bgColor: string;
}[] = [
        {
            title: "Total Revenue",
            value: "$45,231.89",
            change: "+20.1%",
            trend: "up",
            icon: DollarSign,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "Active Users",
            value: "+2,350",
            change: "+180.1%",
            trend: "up",
            icon: Users,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
        },
        {
            title: "New Customers",
            value: "+12,234",
            change: "+19%",
            trend: "up",
            icon: ShoppingCart,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Bounce Rate",
            value: "42.3%",
            change: "-5.4%",
            trend: "down", // Good for bounce rate
            icon: Activity,
            color: "text-rose-600",
            bgColor: "bg-rose-50",
        },
    ];

export const revenueData = [
    { name: "Jan", total: 1500 },
    { name: "Feb", total: 2300 },
    { name: "Mar", total: 3400 },
    { name: "Apr", total: 2900 },
    { name: "May", total: 4500 },
    { name: "Jun", total: 5200 },
    { name: "Jul", total: 4800 },
    { name: "Aug", total: 6100 },
    { name: "Sep", total: 5800 },
    { name: "Oct", total: 7200 },
    { name: "Nov", total: 6500 },
    { name: "Dec", total: 8100 },
];

export const userActivityData = [
    { name: "Mon", active: 400, new: 240 },
    { name: "Tue", active: 300, new: 139 },
    { name: "Wed", active: 550, new: 380 },
    { name: "Thu", active: 450, new: 290 },
    { name: "Fri", active: 600, new: 450 },
    { name: "Sat", active: 700, new: 520 },
    { name: "Sun", active: 650, new: 480 },
];

export const distributionData = [
    { name: "Electronics", value: 400, color: "#6366f1" },
    { name: "Clothing", value: 300, color: "#8b5cf6" },
    { name: "Home", value: 300, color: "#ec4899" },
    { name: "Sports", value: 200, color: "#10b981" },
];

export const recentTransactions = [
    {
        id: "TRX-9871",
        user: "Alice Smith",
        amount: "$450.00",
        status: "Completed",
        date: "2023-10-25",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
        id: "TRX-9872",
        user: "Bob Jones",
        amount: "$120.50",
        status: "Processing",
        date: "2023-10-25",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
        id: "TRX-9873",
        user: "Charlie Day",
        amount: "$850.25",
        status: "Completed",
        date: "2023-10-24",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    },
    {
        id: "TRX-9874",
        user: "Dana White",
        amount: "$65.00",
        status: "Failed",
        date: "2023-10-24",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
        id: "TRX-9875",
        user: "Evan You",
        amount: "$230.00",
        status: "Completed",
        date: "2023-10-23",
        avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    },
];
