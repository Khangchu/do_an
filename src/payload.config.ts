// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Materials } from './collections/Materials'
import { ProductionPlans } from './collections/ProductionPlans'
import { Categories } from './collections/ParentCategories'
import { Posts } from './collections/Posts'
import { Test1 } from './collections/test'
import { Orders } from './collections/Orders'
import { Tasks } from './collections/Tasks'
import { Products_Inventory } from './collections/Products_Inventory'
import { MaterialsAndMachine_Inventory } from './collections/MaterialsAndMachine_Inventory'
import { Suppliers } from './collections/Suppliers'
import { department } from './collections/Department'
import { WorkTime } from './collections/WorkTime'
import { Colors } from './collections/Colors'
import { SubCategories } from './collections/SubCategories'
import { machine } from './collections/Machine'
import { goodsDeliveryNote } from './collections/GoodsDeliveryNote'
import { goodsReceivedNote } from './collections/GoodsReceivedNote'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Products,
    Materials,
    ProductionPlans,
    Orders,
    Categories,
    Posts,
    Test1,
    Tasks,
    Products_Inventory,
    MaterialsAndMachine_Inventory,
    Suppliers,
    department,
    WorkTime,
    Colors,
    SubCategories,
    machine,
    goodsDeliveryNote,
    goodsReceivedNote,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
