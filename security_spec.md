# UniPlug Perfumes Security Specification

## Data Invariants
- A user can only access their own orders and subscription data.
- Products can only be modified by admins.
- Order status can only be modified by admins.
- Timestamps like `createdAt` must be server-generated.
- Users cannot grant themselves admin status.

## The Dirty Dozen Payloads
1. **The Identity Thief**: User A trying to read Order B belonging to User B.
2. **The Price Slasher**: User trying to create an order with a price below the product value.
3. **The Admin Escalator**: User trying to update their profile with `isAdmin: true`.
4. **The Time Traveler**: User trying to set `createdAt` to a future date instead of server time.
5. **The Product Hijacker**: Regular user trying to delete a product.
6. **The Status Spoofer**: User trying to mark their order as `delivered` when it's `pending`.
7. **The Rogue Refiller**: User creating a refill request for another user's ID.
8. **The Ghost Subscription**: User creating multiple active subscriptions to exploit a bug.
9. **The ID Poisoner**: Sending an extremely long or invalid character string as a document ID.
10. **The Shadow Field Injector**: Adding `secret_discount: 100` to a profile update.
11. **The Subscription Interceptor**: User A trying to cancel User B's subscription.
12. **The Public PII Leak**: Trying to list all users to scrape phone numbers.

## Test Runner
Wait for implementation of `firestore.rules` to write tests.
