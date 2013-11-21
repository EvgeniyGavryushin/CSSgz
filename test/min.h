> min_by_CSSO/_size.txt
> prepared_by_CSSgz/_size.txt
> compressed_by_gzip/_size.txt

cd css

for i in *.css;
do

../../../csso/bin/csso $i ../min_by_CSSO/$i
du -b ../min_by_CSSO/$i >> ../min_by_CSSO/_size.txt

../../bin/CSSgz ../min_by_CSSO/$i ../prepared_by_CSSgz/$i
du -b ../prepared_by_CSSgz/$i >> ../prepared_by_CSSgz/_size.txt

gzip -9 -c ../prepared_by_CSSgz/$i > ../compressed_by_gzip/$i.gz
du -b ../compressed_by_gzip/$i.gz >> ../compressed_by_gzip/_size.txt

done
