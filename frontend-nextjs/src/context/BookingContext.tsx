'use client';

import React, { createContext, useContext, useState } from 'react';

interface BookingContextType {
  openBooking: (type?: 'BOOK_TABLE' | 'TAKEAWAY') => void;
  closeBooking: () => void;
  isOpen: boolean;
  bookingType: 'BOOK_TABLE' | 'TAKEAWAY';
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'BOOK_TABLE' | 'TAKEAWAY'>('TAKEAWAY');

  const openBooking = (type: 'BOOK_TABLE' | 'TAKEAWAY' = 'TAKEAWAY') => {
    setBookingType(type);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking, isOpen, bookingType }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
