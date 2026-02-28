export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            packages: {
                Row: {
                    id: string
                    created_at: string
                    title: string
                    description: string | null
                    price: number
                    start_date: string
                    end_date: string
                    image_url: string | null
                    capacity: number | null
                    available_seats: number | null
                    package_type: string | null
                    hotel_makkah: string | null
                    hotel_madinah: string | null
                    airlines: string | null
                    promo_price: number | null
                    itinerary_pdf_url: string | null
                    is_active: boolean // Note: Schema said default true, but let's be explicit
                }
                Insert: {
                    id?: string
                    created_at?: string
                    title: string
                    description?: string | null
                    price: number
                    start_date: string
                    end_date: string
                    image_url?: string | null
                    capacity?: number | null
                    available_seats?: number | null
                    package_type?: string | null
                    hotel_makkah?: string | null
                    hotel_madinah?: string | null
                    airlines?: string | null
                    promo_price?: number | null
                    itinerary_pdf_url?: string | null
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    title?: string
                    description?: string | null
                    price?: number
                    start_date?: string
                    end_date?: string
                    image_url?: string | null
                    capacity?: number | null
                    available_seats?: number | null
                    package_type?: string | null
                    hotel_makkah?: string | null
                    hotel_madinah?: string | null
                    airlines?: string | null
                    promo_price?: number | null
                    itinerary_pdf_url?: string | null
                    is_active?: boolean
                }
            }
            bookings: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string
                    package_id: string
                    status: 'pending' | 'confirmed' | 'cancelled'
                    payment_status: 'unpaid' | 'paid' | 'refunded'
                    ktp_url: string | null
                    passport_url: string | null
                    payment_method: 'full' | 'installment' | 'dp' | null
                    invoice_id: string | null
                    tracking_data?: Json | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    user_id: string
                    package_id: string
                    status?: 'pending' | 'confirmed' | 'cancelled'
                    payment_status?: 'unpaid' | 'paid' | 'refunded'
                    ktp_url?: string | null
                    passport_url?: string | null
                    payment_method?: 'full' | 'installment' | 'dp' | null
                    invoice_id?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string
                    package_id?: string
                    status?: 'pending' | 'confirmed' | 'cancelled'
                    payment_status?: 'unpaid' | 'paid' | 'refunded'
                    ktp_url?: string | null
                    passport_url?: string | null
                    payment_method?: 'full' | 'installment' | 'dp' | null
                    invoice_id?: string | null
                }
            }
            profiles: {
                Row: {
                    id: string
                    updated_at: string | null
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    website: string | null
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                }
            }
        }
    }
}
