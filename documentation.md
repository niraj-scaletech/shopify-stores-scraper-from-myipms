# Shopify Stores Scraper from myip.ms

## Overview

The **Shopify Stores Scraper from myip.ms** is a tool designed to collect detailed information about Shopify stores from the **myip.ms** platform. This scraper extracts essential business details such as website, IP address, hosting company, location, and DNS records from Shopify stores hosted on myip.ms.

## **Extracted Data Fields**

| **Field**                        | **Description**                                                               |
|----------------------------------|-------------------------------------------------------------------------------|
| **No**                           | The entry number for the Shopify store in the list.                           |
| **Web_Site**                     | The official website URL of the Shopify store.                                |
| **DNS_Records**                  | DNS records for the store’s domain, providing insight into its hosting setup. |
| **Web_Hosting_City**             | The city where the store's hosting company is located.                        |
| **Record_Update_Time**           | The last time the DNS record was updated.                                     |
| **Top_Level_Hostname**           | The top-level domain used by the store.                                       |
| **Website_IP_Address**           | The IP address of the Shopify store’s website.                                |
| **Website_Popularity**           | The store’s popularity based on traffic or other relevant metrics.            |
| **IP_Reverse_DNS_Host**          | The reverse DNS hostname associated with the website's IP address.            |
| **World_Site_Popular_Rating**    | The global popularity ranking of the Shopify store’s website.                 |
| **Web_Hosting_Company_IP_Owner** | The owner of the IP address for the store’s hosting company.                   |
| **Web_Hosting_Server_IP_Location**| The physical location of the hosting server's IP.                             |
| **Website_IPv6_Address**         | The IPv6 address for the store’s website, if available.                       |
| **Web_Hosting_State**            | The state where the hosting company’s server is located.                      |


## Input Parameters

### **fromPage** and **toPage**
- **fromPage**: The starting page number for scraping.
- **toPage**: The ending page number for scraping.

## How to Use

1. **Step 1**: Click `Try it!`
2. **Step 2**: Enter the starting page number (fromPage) and ending page number (toPage).
3. **Step 3**: Click the `Submit` button to start the scraping process.


## Sample Data Preview

| **No** | **Web_Site**     | **DNS_Records**                                                                | **Web_Hosting_City** | **Record_Update_Time**  | **Top_Level_Hostname** | **Website_IP_Address** | **Website_Popularity**     | **IP_Reverse_DNS_Host**   | **World_Site_Popular_Rating**| **Web_Hosting_Company_IP_Owner** | **Web_Hosting_Server_IP_Location** | **Website_IPv6_Address** | **Web_Hosting_State**   |
|--------|------------------|--------------------------------------------------------------------------------|----------------------|-------------------------|------------------------|------------------------|----------------------------|---------------------------|------------------------------|----------------------------------|------------------------------------|--------------------------|-------------------------|
| 1      | myshopify.com    | dns1.p06.nsone.net, ns1.dnsimple.com, ns2.dnsimple.com                         | N/A                  | 24 Nov 2024, 02:01      | myshopify.com          | 23.227.38.74           | 3,500,000 visitors per day | shops.myshopify.com       | #63                          | Shopify, Inc                     | Canada                             | N/A                      | N/A                     |
| 2      | shopify.com      | dns1.p06.nsone.net, dns3.p06.nsone.net, ns4.dnsimple.com                       | N/A                  | 27 Nov 2024, 13:45      | shopify.com            | 23.227.38.33           | 2,100,000 visitors per day | checkout.shopify.com      | #122                         | Shopify, Inc                     | Canada                             | N/A                      | N/A                     |
| 3      | overstock.com    | dns1.p01.nsone.net, dns2.p01.nsone.net, dns3.p01.nsone.net, dns4.p01.nsone.net | N/A                  | 24 Nov 2024, 02:01      | myshopify.com          | 23.227.38.65           | 160,000 visitors per day   | myshopify.com             | #2,752                       | Shopify, Inc                     | Canada                             | 2620:127:f00f:5::        | N/A                     |

## Notes

For questions regarding the Shopify Stores Scraper or customization requests, please reach out to our support team.

## Is Scraping MyIP.ms Legal?

Web scraping is generally permitted for publicly accessible, non-personal data. Please ensure compliance with relevant laws and consult legal advice if necessary. Read more about web scraping legality in this [article](#).

