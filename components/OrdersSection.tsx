"use client";

import { orders } from '@/lib/data';
import { Package, ArrowRight } from 'lucide-react';

export default function OrdersSection() {
  return (
    <div className="bg-bg-card border-2 border-accent-blue rounded-[20px] p-5 md:p-6 mb-8 md:mb-10">
      <div className="flex items-center gap-2 md:gap-2.5 text-sm md:text-base font-extrabold text-accent-blue mb-4 md:mb-5">
        <Package size={16}  /> MES COMMANDES
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-5 md:mb-6">
        <div className="bg-bg-dark rounded-xl md:rounded-[14px] p-3 md:p-4 text-center">
          <div className="text-2xl md:text-[28px] font-extrabold text-accent-orange mb-1">3</div>
          <div className="text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider">DEMANDES EN COURS</div>
        </div>
        <div className="bg-bg-dark rounded-xl md:rounded-[14px] p-3 md:p-4 text-center">
          <div className="text-2xl md:text-[28px] font-extrabold text-accent-blue mb-1">5</div>
          <div className="text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider">COMMANDES</div>
        </div>
        <div className="bg-bg-dark rounded-xl md:rounded-[14px] p-3 md:p-4 text-center">
          <div className="text-2xl md:text-[28px] font-extrabold text-accent-green mb-1">2</div>
          <div className="text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider">EN LIVRAISON</div>
        </div>
        <div className="bg-bg-dark rounded-xl md:rounded-[14px] p-3 md:p-4 text-center">
          <div className="text-2xl md:text-[28px] font-extrabold text-accent-purple mb-1">8</div>
          <div className="text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider">LIVREES</div>
        </div>
      </div>

      {orders.map(order => (
        <div key={order.id} className="bg-bg-dark rounded-xl md:rounded-[14px] p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 border-l-4 border-accent-orange mb-3 md:mb-4 last:mb-0">
          <div>
            <h4 className="text-xs md:text-sm font-bold mb-0.5 md:mb-1">{order.title}</h4>
            <div className="text-[10px] md:text-xs text-text-muted">{order.vehicle} - {order.date}</div>
          </div>
          <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-text-muted flex-wrap">
            {order.timeline.map((step, i) => (
              <span key={i} className="flex items-center gap-0.5 md:gap-1">
                <span className={step.active ? 'text-accent-blue font-semibold' : ''}>{step.label}</span>
                {i < order.timeline.length - 1 && <ArrowRight size={10}  className="text-text-muted" />}
              </span>
            ))}
          </div>
          <span className={`${order.statusColor} text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-bold`}>
            {order.status}
          </span>
        </div>
      ))}
    </div>
  );
}
