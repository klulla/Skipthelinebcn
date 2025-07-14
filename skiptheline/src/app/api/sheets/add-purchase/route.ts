import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const purchaseData = await request.json();
    
    // For now, just log the data that would be saved to Google Sheets
    console.log('Google Sheets Data:', {
      confirmationId: purchaseData.confirmationId,
      eventTitle: purchaseData.eventTitle,
      customerName: purchaseData.customerName,
      email: purchaseData.email,
      partySize: purchaseData.partySize,
      totalAmount: purchaseData.totalAmount,
      purchaseDate: purchaseData.purchaseDate,
      status: purchaseData.status,
      spreadsheetLink: purchaseData.spreadsheetLink
    });
    
    // In production, this would:
    // 1. Extract sheet ID from spreadsheetLink
    // 2. Use Google Sheets API to add the row
    // 3. Handle any errors
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data logged successfully (Google Sheets integration pending)' 
    });
  } catch (error) {
    console.error('Error processing Google Sheets data:', error);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
} 