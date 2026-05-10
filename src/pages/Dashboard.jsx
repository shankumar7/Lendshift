import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="card p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon className="w-5 h-5" />
      </div>
      {change && (
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
    </div>
  </div>
);

// Helper for classes inside the file if needed, but I'll use the imported one
import { cn } from '@/utils/cn';

const Dashboard = () => {
  const activeLoans = [
    { id: 'LN-8492', amount: '$12,500', status: 'In Progress', type: 'Personal Loan', progress: 65 },
    { id: 'LN-2940', amount: '$45,000', status: 'Active', type: 'Business Loan', progress: 100 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display dark:text-white">Welcome back, Alex!</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what is happening with your loan applications.</p>
        </div>
        <Link to="/apply" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          New Application
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Borrowed" 
          value="$57,500" 
          change="+12%" 
          icon={TrendingUp} 
          color="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
        />
        <StatCard 
          title="Active Applications" 
          value="2" 
          icon={Clock} 
          color="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" 
        />
        <StatCard 
          title="Credit Score" 
          value="742" 
          change="+5pts" 
          icon={CheckCircle2} 
          color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" 
        />
        <StatCard 
          title="Pending Actions" 
          value="1" 
          icon={AlertCircle} 
          color="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold dark:text-white">Recent Applications</h3>
              <button className="text-sm text-primary-600 font-medium">View All</button>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {activeLoans.map((loan) => (
                <div key={loan.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{loan.type}</p>
                      <p className="text-xs text-slate-500">{loan.id} • {loan.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block w-32">
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-600 transition-all duration-500" 
                          style={{ width: `${loan.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-right mt-1 text-slate-500">{loan.progress}% Complete</p>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      loan.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {loan.status}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 bg-primary-600 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold">New Year Offer!</h3>
              <p className="text-primary-100 text-sm mt-2">Get up to $100,000 personal loan with 0% processing fee.</p>
              <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-bold text-sm mt-4 hover:bg-primary-50 transition-colors">
                Apply Now
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary-500 rounded-full opacity-50 blur-3xl"></div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold dark:text-white">Tips for you</h3>
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Improve your credit score by paying off small debts early.</p>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Keep your documents ready for faster loan approval.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
